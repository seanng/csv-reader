const { UniqueObject, StateChange } = require('./config.js')

const findObject = (objectType, objectNumber, cb) => {
  UniqueObject.findOne({ where: { objectType, objectNumber } })
  .then(cb).catch(cb)
}

const retrieveAndUpdateObject = (type, id, timestamp, changes, cb) => {
  findObject(type, id, obj => {
    if (!obj) console.log('no obj', obj);
    console.log('found obj', obj);
    cb()
  })
}

const postHandler = (json, callback) => {
  json.data.forEach( row => {
    const type = row.object_type,
            id = row.object_id,
     timestamp = row.timestamp,
       changes = row.object_changes;

    if (type !== '' && id !== '') {
      retrieveAndUpdateObject(type, id, timestamp, changes, callback);
    }
  })
}

const getHandler = () => {

}


module.exports { postHandler, getHandler }