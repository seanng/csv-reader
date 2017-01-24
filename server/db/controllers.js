const { UniqueObject, StateChange } = require('./config.js')

const postHandler = (json, callback) => {
  json.data.forEach( row => {
    const type = row.object_type,
            id = row.object_id,
     timestamp = row.timestamp,
       changes = row.object_changes;

    if (type !== '' && id !== '') {
      retrieveAndUpdateObject(type, id, timestamp, changes);
    }


  })
}

const getHandler = () => {

}


module.exports { postHandler, getHandler }