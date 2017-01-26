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
  str = JSON.parse(str);
  if (typeof str === 'string') {
    str = JSON.parse(str);
  }
  return str;
}

const getCurrentState = (states, row, objId) => {
  let priorPos = null;
  for (let i = states.length-1; i >= 0; i--) {
    if (states[i].timeOfChange < row.timestamp) {
      priorPos = i;
      break;
    }
  }
  if (priorPos === null) {
    return {
      newState: {
        stateAttributes: JSON.parse(row.object_changes),
        updatedAttributes: JSON.parse(row.object_changes),
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
      updatedAttributes: JSON.parse(row.object_changes),
      timeOfChange: row.timestamp,
      UniqueObjectId: objId
    },
    priorPos
  }
}

const getObjectStates = (obj) => {
  return StateChange.findAll({
    where: { UniqueObjectId: obj.dataValues.id },
    order: [['timeOfChange', 'DESC']]
  })
}

const getUpdatedState = (prev, next) => {
  let newStateAttributes = {};
  let prevAttributes = JSON.parse(prev.stateAttributes);
  let nextAttributes = JSON.parse(next.updatedAttributes);
  for (let key in prevAttributes) {
    newStateAttributes[key] = prevAttributes[key];
  }
  for (let key in nextAttributes) {
    newStateAttributes[key] = nextAttributes[key];
  }
  return JSON.stringify(newStateAttributes);
}

const updateState = (prev, next, resolve, firstTime) => {
  if (!firstTime) {
    StateChange.findOne({where: { id: prev.id }})
    .then( prevState => {
      let updatedState = getUpdatedState(prevState, next);
      StateChange.update(
        {stateAttributes: updatedState},
        {where: {id: next.id} })
      .then( state => resolve(state) )
    })
  } else {
    let updatedState = getUpdatedState(prev, next);
    StateChange.update(
      {stateAttributes: updatedState},
      {where: {id: next.id} })
    .then( state => resolve(state) )
  }
}

const updateFutureStates = (priorPos, states, newState) => {

  priorPos = priorPos === null ? -1 : priorPos;
  let statesToUpdate = states.slice(priorPos+1);
  let count = 0;

  statesToUpdate.map( (state, i) => {
    return new Promise((resolve, reject) => {
      if (count === 0) {
        count++;
        return updateState(newState, state, resolve, true);
      } else if (count < statesToUpdate.length) {
        count++;
        return updateState(statesToUpdate[i-1], state, resolve);
      } else {
        return resolve();
      }
    })
  })
}

const createNewState = (newState, callback) => {

  newState.stateAttributes = JSON.stringify(newState.stateAttributes)

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
    if (states.length > priorPos) updateFutureStates(priorPos, states, newState);

  // 5. Insert the state into the DB.
    createNewState(newState, callback);
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