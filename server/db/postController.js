const Sequelize = require('sequelize');
const { db, UniqueObject, StateChange } = require('./config.js')

const findOrCreateObject = (objectType, objectNumber) => {
  return UniqueObject.findOne({ where: { objectType, objectNumber } })
  .then( obj => {
    if (!obj) {
      return UniqueObject.create({objectType, objectNumber});
    } else {
      return obj
    }
  })
  .catch(err => {
    throw new Error(err);
  })
}

const parser = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  return parser(JSON.parse(str));
}

const getCurrentState = (states, row, objId) => {
  let priorPos = null;
  for (let i = states.length-1; i >= 0; i--) {
    if (Number(states[i].timeOfChange) < Number(row.timestamp)) {
      console.log(states[i].timeOfChange, row.timestamp);
      priorPos = i;
      break;
    }
  }
  if (priorPos === null) {
    return {
      newState: {
        stateAttributes: parser(row.object_changes),
        updatedAttributes: parser(row.object_changes),
        timeOfChange: row.timestamp,
        UniqueObjectId: objId
      },
      priorPos
    }
  }

  let stateAttributes = {};
  let parsedPriorState = parser(states[priorPos].stateAttributes);
  let parsedRowChanges = parser(row.object_changes);

  for (let key in parsedPriorState) {
    stateAttributes[key] = parsedPriorState[key];
  }

  for (let key in parsedRowChanges) {
    stateAttributes[key] = parsedRowChanges[key];
  }

  return {
    newState: {
      stateAttributes: stateAttributes,
      updatedAttributes: parser(row.object_changes),
      timeOfChange: row.timestamp,
      UniqueObjectId: objId
    },
    priorPos
  }
}

const getObjectStates = (obj) => {
  return StateChange.findAll({
    where: { UniqueObjectId: obj.dataValues.id },
    order: [[Sequelize.fn('min', Sequelize.col('timeOfChange')), 'ASC']],
    group: ['StateChange.id']
  })
}

const getUpdatedState = (prev, next) => {
  let newStateAttributes = {};
  let prevAttributes = parser(prev.stateAttributes);
  let nextAttributes = parser(next.updatedAttributes);
  for (let key in prevAttributes) {
    newStateAttributes[key] = prevAttributes[key];
  }
  for (let key in nextAttributes) {
    newStateAttributes[key] = nextAttributes[key];
  }
  return JSON.stringify(newStateAttributes);
}

const updateState = (prev, next, callback, firstTime) => {

  if (!firstTime) {
    StateChange.findOne({where: { id: prev.id }})
    .then( prevState => {
      let updatedState = getUpdatedState(prevState, next);
      StateChange.update(
        {stateAttributes: updatedState},
        {where: {id: next.id} })
      .then( state => callback(updatedState) )
    })
  } else {
    let updatedState = getUpdatedState(prev, next);
    StateChange.update(
      {stateAttributes: updatedState},
      {where: {id: next.id} })
    .then( state => callback(updatedState) )
  }
}

const updateFutureStates = (priorPos, states, newState) => {

  priorPos = priorPos === null ? -1 : priorPos;
  let statesToUpdate = states.slice(priorPos+1);

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
  findOrCreateObject(row.object_type, row.object_id)

  // 2. Get the Object States
  .then( obj => {
    UniqueObjectId = obj.dataValues.id;
    return getObjectStates(obj);
  })

  // 3. Get Current State's attributes from prior State :
  .then( states => {
    let { newState, priorPos } = getCurrentState(states, row, UniqueObjectId);

  // 4. If this wasn't the latest timestamp, then we should update all future states.
    if (states.length > priorPos) {
      return updateFutureStates(priorPos, states, newState)
      .then(() => createNewState(newState, callback));
  // 5. Insert the state into the DB.
    } else {
      createNewState(newState, callback);
    }
  })
  .catch(err => console.error('error in retrieve and update!', err))
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