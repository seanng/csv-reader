const Sequelize = require('sequelize');

const db = new Sequelize(`csvreader`, `root`);

const UniqueObject = db.define('UniqueObject', {
  objectType: Sequelize.STRING,
  objectNumber: Sequelize.INTEGER
})

const StateChange = db.define('StateChange', {
  timestamp: Sequelize.DATE,
  attributes: Sequelize.STRING //stringified_object
})

StateChange.belongsTo(UniqueObject, {as: 'object'})

module.exports = {db, UniqueObject, StateChange};
