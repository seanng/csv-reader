/*jshint esversion: 6*/
(function() {

  angular.module('csvReader.services', [
  ])
  .factory('services', ($http, AppSettings) => {

    let store = {};

    const clone = (obj) => {
      if (null == obj || "object" != typeof obj) return obj;
      let copy = obj.constructor();
      for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    }

    const createEntry = (entryList, row) => {
      let changes = JSON.parse(row.object_changes),
          lastChange = entryList[entryList.length-1] || {},
          newAddition = clone(lastChange);

      newAddition['timestamp'] = row.timestamp;
      if (typeof changes === 'string') changes = JSON.parse(changes); //sometimes value can be double-stringified
      for (let key in changes) newAddition[key] = changes[key];
      return newAddition;
    }

    const updateStore = (json, callback) => {
      json.data.forEach(row => {
        const type = row.object_type,
              id = row.object_id;

        if (type !== '' && id !== '') {
          if (!store[type])     store[type] = {};
          if (!store[type][id]) store[type][id] = [];
          let newEntry = createEntry(store[type][id], row);
          store[type][id].push(newEntry);
        }

      })
      callback(store);
    }

    const postToServer = data => {
      const url = AppSettings.apiUrl+'/api',
        request = { method: 'POST', url, data };

      $http(request)
        .then( succ => {
          console.log('post success.', succ);
        })
        .catch( fail => {
          console.error(fail);
        })
    }

    const submitFile = (file, callback) => {
      const complete = (json) => {
        postToServer(json)
        // updateStore(json, callback);
      }
      Papa.parse(file, { complete, header: true })
    }

    const getData = () => store;

    return {
      submitFile,
      getData
    };
  });
})();
