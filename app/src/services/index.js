/*jshint esversion: 6*/
(function() {

  angular.module('csvReader.services', [
    'csvReader.services.request',
    'csvReader.services.formatter'
  ])
  .factory('services', (AppSettings, formatMessage, handleRequest) => {

    const postToServer = (data, callback) => {
      const url = AppSettings.apiUrl+'/api',
        request = { method: 'POST', url, data };

      handleRequest(request, (failure, success) => {
        return failure ? callback(data, false, failure) :
        callback(data, true, success)
      })
    }

    const submitFile = (file, callback) => {
      const complete = (json) => {
        postToServer(json, callback)
      }
      Papa.parse(file, { complete, header: true })
    }

    const queryServer = (query, callback) => {
      const url = `${AppSettings.apiUrl}/api?objtype=${query.objType}&objnumber=${query.objId}&timestamp=${query.timestamp}`,
      request = {method: 'GET', url};

      handleRequest(request, callback)
    }

    return {
      submitFile,
      queryServer,
      formatMessage
    };
  });
})();
