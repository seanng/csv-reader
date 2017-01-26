const Sequelize = require('sequelize'),
{ db, UniqueObject, StateChange } = require('./config.js'),
{ findObject, getObjectStates, getPriorChangeIndex, getUpdatedState, parser } = require('../utils/helpers.js')

const getCurrentState = (states, row, objId) => {
  let priorChangeIndex = getPriorChangeIndex(states, row.timestamp);
  if (priorChangeIndex === null) {
    return {
      newState: {
        stateAttributes: parser(row.object_changes),
        updatedAttributes: parser(row.object_changes),
        timeOfChange: row.timestamp,
        UniqueObjectId: objId
      },
      priorChangeIndex
    }
  }
  // If this isn't the first state change
  let updatedState = getUpdatedState(states[priorChangeIndex].stateAttributes, row.object_changes);

  return {
    newState: {
      stateAttributes: updatedState,
      updatedAttributes: parser(row.object_changes),
      timeOfChange: row.timestamp,
      UniqueObjectId: objId
    },
    priorChangeIndex
  }
}

const updateState = (prev, next, callback, firstTime) => {
  if (!firstTime) {
    StateChange.findOne({where: { id: prev.id }})
    .then( prevState => {
      let updatedState = getUpdatedState(prevState.stateAttributes, next.updatedAttributes);
      StateChange.update(
        {stateAttributes: JSON.stringify(updatedState)},
        {where: {id: next.id} })
      .then( state => callback(updatedState) )
    })
  } else {
    let updatedState = getUpdatedState(prev.stateAttributes, next.updatedAttributes);
    StateChange.update(
      {stateAttributes: JSON.stringify(updatedState)},
      {where: {id: next.id} })
    .then( state => {
      callback(updatedState) })
  }
}

const updateFutureStates = (priorChangeIndex, states, newState) => {

  priorChangeIndex = priorChangeIndex === null ? -1 : priorChangeIndex;
  let statesToUpdate = states.slice(priorChangeIndex+1);

  return Promise.all(statesToUpdate.map( (state, i) => {
    let count = 0, prev;
    return new Promise((resolve, reject) => {
      if (count === 0) {
        count++;
        return updateState(newState, state, (newPrev) =>{
          prev = newPrev;
          return resolve();
        }, true);
      } else if (count < statesToUpdate.length) {
        count++;
        return updateState(prev, state, (newPrev)=>{
          prev = newPrev;
          return resolve();
        });
      } else {
        return resolve();
      }
    })
  }))
}

const createNewState = (newState, callback) => {

  newState.stateAttributes = JSON.stringify(newState.stateAttributes)
  newState.updatedAttributes = JSON.stringify(newState.updatedAttributes)

  return StateChange.create(newState)
  .then( statechange => callback(statechange) )
}

const insertState = (row, callback) => {

  let UniqueObjectId;

  // 1. Get the Object
  findObject(row.object_type, row.object_id, true)

  // 2. Get the Object States
  .then( obj => {
    UniqueObjectId = obj.dataValues.id;
    return getObjectStates(obj);
  })

  // 3. Get Current State's attributes from prior State :
  .then( states => {
    let { newState, priorChangeIndex } = getCurrentState(states, row, UniqueObjectId);

  // 4. If this wasn't the latest timestamp, then we should update all future states.
    if (states.length > priorChangeIndex) {
      return updateFutureStates(priorChangeIndex, states, newState)
      .then(() => createNewState(newState, callback))
      .catch((err) => console.error('error when updating future states!', err));
  // 5. Insert the state into the DB.
    } else {
      createNewState(newState, callback);
    }
  })
  .catch(err => console.error('error in insertState!', err))
}

const postHandler = (json, callback) => {
  let results = [];

  json.data.reduce((promiseChain, row) => {
    return promiseChain.then(() => new Promise( resolve => {
      if (row.object_type !== '' && row.object_id !== '') {
        const resolution = (statechange) => {
          results.push(statechange);
          resolve();
        }
        return insertState(row, resolution);
      } else {
        return resolve();
      }
    }));
  }, Promise.resolve()).then( () => callback(results) );

}

module.exports = postHandler;