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

const updateObject = (row, callback) => {
  findOrCreateObject(row.object_type, row.object_id)
  .then( obj => {
    StateChange.create({
      timeOfChange: row.timestamp,
      updatedAttributes: row.object_changes,
      UniqueObjectId: obj.dataValues.id
    })
    .then( statechange => callback( obj, statechange))
  })
  .catch(err => console.error('error in retrieve and update!', err))
}

const postHandler = (json, callback) => {
  let results = [];

  json.data.reduce((promiseChain, row) => {
    const type = row.object_type,
            id = row.object_id,
     timestamp = row.timestamp,
       changes = row.object_changes;

    return promiseChain.then(() => new Promise( resolve => {
      if (row.object_type !== '' && row.object_id !== '') {

        const resolution = (object, statechange) => {
          results.push({object, statechange})
          resolve();
        }

        return updateObject(row, resolution);

      } else {
        return resolve();
      }
    }));
  }, Promise.resolve()).then( () => callback(results) );

}

const getHandler = () => {

}


module.exports = { postHandler, getHandler }