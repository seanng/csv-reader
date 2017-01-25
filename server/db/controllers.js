const { db, UniqueObject, StateChange } = require('./config.js')

const findOrCreateObject = (objectType, objectNumber) => {
  return UniqueObject.findOne({ where: { objectType, objectNumber } })
  .then( obj => {
    if (!obj) {
      console.log('obj not found?');
      return UniqueObject.create({objectType, objectNumber});
    } else {
      console.log('object found.')
      return obj
    }
  })
  .catch(err => {
    throw new Error(err);
  })
}

const getCurrentState = (states, row, objId) => {

  let priorPos = null;

  for (let i = states.length-1; i >= 0; i--) {
    if (states[i].timeOfChange < row.timestamp) {
      priorPos = i;
      break;
    }
  }

  // row.object_changes = row.object_changes.replace(/\\/g,"");

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

  let parsedPriorState = JSON.parse(JSON.parse(states[priorPos].stateAttributes));
  console.log('parsedPriorState after ', parsedPriorState)

  let parsedRowChanges = JSON.parse(JSON.parse(row.object_changes));
  console.log('parsedRowChanges after', parsedRowChanges)

  for (let key in parsedPriorState) {
    console.log('parsedpriorstate key', key);
    stateAttributes[key] = parsedPriorState[key];
  }
  console.log('STATE ATTRIBUTES after.', stateAttributes)

  for (let key in parsedRowChanges) {
    console.log('parsedrowchanges key', key);
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

const updateState = (prevState, currState) => {

  let parsedPrevStateAttributes;
  let attributeUpdate = {};

  if (typeof (prevState.stateAttributes) !== 'object') {
    parsedPrevStateAttributes = JSON.parse(prevState.stateAttributes);
  }

  // let parsedCurrStateAttributes = JSON.parse(currState.stateAttributes);
  let parsedCurrStateUpdatedAttributes = JSON.parse(currState.updatedAttributes);

  for (let key in parsedPrevStateAttributes) {
    attributeUpdate[key] = parsedPrevStateAttributes[key];
  }

  console.log('attributeUpdate (after adding previous)', attributeUpdate);

  for (let key in parsedCurrStateUpdatedAttributes) {
    attributeUpdate[key] = parsedCurrStateUpdatedAttributes[key];
  }

  console.log('attributeUpdate (after adding updated)', attributeUpdate);

  StateChange.update(
    { stateAttributes: attributeUpdate },
    { where: { id: currState.id } })
  // currState.stateAttributes = JSON.parse(parsedCurrStateAttributes);
}

const updateFutureStates = (priorPos, states, newState) => {

  priorPos = priorPos === null ? 0 : priorPos;

  for (let i = priorPos; i < states.length; i++) {
    if (i === priorPos) {
      updateState(newState, states[i])
    } else {
      console.log(states[i].id, states[i].stateAttributes, states[i-1].id, 'prior')
      updateState(states[i-1], states[i])
      console.log(states[i].stateAttributes, 'after')
    }

  }
}

const createNewState = (newState, callback) => {

  newState.stateAttributes = JSON.stringify(newState.stateAttributes)

  return StateChange.create(newState)
  .then( statechange => callback(statechange) )
}

const updateObject = (row, callback) => {

  let UniqueObjectId;

  findOrCreateObject(row.object_type, row.object_id)
  .then( obj => {
    UniqueObjectId = obj.dataValues.id;
    return getObjectStates(obj);
  })
  .then( states => { // promisified array (supposed to be).
    // console.log('row.', row)
    let { newState, priorPos } = getCurrentState(states, row, UniqueObjectId);
    if (states.length - 1 > priorPos) {
      console.log('WE SHOULD UPDATE THE FUTURE STATES HERE');
      updateFutureStates(priorPos, states, newState);
    }
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
          results.push(statechange)
          resolve();
        }

        return updateObject(row, resolution);

      } else {
        return resolve();
      }
    }));
  }, Promise.resolve()).then( () => callback(results) );

}

module.exports = { postHandler, queryHandler }