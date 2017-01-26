const Sequelize = require('sequelize'),
{ db, UniqueObject, StateChange } = require('../db/config.js');

const parser = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  return parser(JSON.parse(str));
}

const getUpdatedState = (prevAttributes, nextAttributes) => {
  let newStateAttributes = {};

  prevAttributes = parser(prevAttributes);
  nextAttributes = parser(nextAttributes);

  for (let key in prevAttributes) {
    newStateAttributes[key] = prevAttributes[key];
  }
  for (let key in nextAttributes) {
    newStateAttributes[key] = nextAttributes[key];
  }
  return newStateAttributes;
}

const getObjectStates = (obj) => {
  return StateChange.findAll({
    where: { UniqueObjectId: obj.dataValues.id },
    order: [[Sequelize.fn('min', Sequelize.col('timeOfChange')), 'ASC']],
    group: ['StateChange.id']
  })
}

const getPriorChangeIndex = (states, currTimestamp) => {
  for (let i = states.length-1; i >= 0; i--) {
    if ((states[i].timeOfChange * 1) < (currTimestamp * 1)) {
      return i;
    }
  }
  return null;
}

const findObject = (objectType, objectNumber, postRequest) =>
  UniqueObject.findOne({
    where: { objectType, objectNumber }
  })
  .then( obj => {
    if (!obj) {
      if (postRequest) return UniqueObject.create({objectType, objectNumber});
      throw new Error(obj);
    } else {
      return obj
    }
  })
  .catch(err => {
    throw new Error(err);
  })


module.exports = {
  findObject,
  getObjectStates,
  getPriorChangeIndex,
  getUpdatedState,
  parser
}