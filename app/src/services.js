/*jshint esversion: 6*/
(function() {

  angular.module('csvReader.services', [
  ])
  .factory('services', ($http, AppSettings) => {

      store = {};

    const postToServer = data => {
      const url = AppSettings.apiUrl+'/api',
        request = { method: 'POST', url, data };

      $http(request)
      .then( response => {
        console.log('post success.', response);

      })
      .catch( failure => {
        console.error(failure);
      })
    }

    const submitFile = (file, callback) => {
      const complete = (json) => {
        postToServer(json)
      }
      Papa.parse(file, { complete, header: true })
    }

    const getFromServer = (url, callback) => {
      request = { method: 'GET', url };

      $http(request)
      .then( response => {
        console.log('fetch success', response);
        callback(null, response);
      })
      .catch( failure => {
        console.error(failure);
        callback(error);
      })
    }

    const unixConversion = (date, time) => {
      let timestamp;

      return timestamp;
    }

    const queryInput = (query) => {

      const callback = (error, success) => {
        if (error) {
          return;
        }
        return;
      }

      query = `?objtype=${query.objType}&objnumber=${query.objId}&timestamp=${query.timestamp}`;

      const url = AppSettings.apiUrl+'/api' + query;

      return getFromServer(url, callback)
      return console.log('someone didnt fill in date and time')
    }

    return {
      submitFile,
      queryInput
    };
  });
})();
