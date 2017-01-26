const Sequelize = require('sequelize'),
{ db, UniqueObject, StateChange } = require('./config.js'),
{ findObject, getObjectStates, getPriorChangeIndex } = require('../utils/helpers.js');

const queryHandler = (query, callback) => {
  findObject(query.objtype, query.objnumber, false)
  .then( obj => getObjectStates(obj))
  .then( states => {
    let lastState = states[getPriorChangeIndex(states, query.timestamp)];
    return callback(null, lastState)
  })
  .catch( err => callback(err));

}

const fetchHandler = (callback) => {
  StateChange.findAll()
  .then( states => callback(states));
}


module.exports = {
  queryHandler, fetchHandler
}