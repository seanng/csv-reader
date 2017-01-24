const { UniqueObject, StateChange } = require('../db/config.js');

const findObject = (objectType, objectNumber, cb) => {
  UniqueObject.findOne({ where: { objectType, objectNumber } })
  .then(cb).catch(cb)
}

const createOrUpdateObject = (type, id, cb) => {
  findObject(type, id, obj => {
    if (!obj) console.log('no obj', obj);
    console.log('found obj', obj);
    cb()
  })
}

const postHandler = (json, callback) => {
  // console.log(json)
  //
  json.data.forEach( row => {
    const type = row.object_type,
            id = row.object_id,
            timestamp = row.timestamp,
            changes = row.object_changes;

    if (type !== '' && id !== '') {
      createOrUpdateObject(type, id, callback)
    }


  })
  // Obj.
}

module.exports = postHandler;