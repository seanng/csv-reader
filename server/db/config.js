const Sequelize = require('sequelize');

// ** hardcoded for the sake of convenience.
const user = 'postgres', pass = '', host = 'localhost', port = 5432;

const db = new Sequelize(`postgres://${user}:${pass}@${host}:${port}/csvreader`)

const UniqueObject = db.define('UniqueObject', {
  objectType: Sequelize.STRING,
  objectNumber: Sequelize.INTEGER
})

const StateChange = db.define('StateChange', {
  timeOfChange: Sequelize.BIGINT,
  stateAttributes: Sequelize.STRING,
  updatedAttributes: Sequelize.STRING //stringified_object
})

UniqueObject.hasMany(StateChange);
StateChange.belongsTo(UniqueObject);

module.exports = {db, UniqueObject, StateChange};
