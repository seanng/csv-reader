/*jshint esversion: 6*/
(function() {

  angular.module('csvReader.services', [
    'csvReader.services.request'
  ])
  .factory('services', ($http, AppSettings, handleRequest) => {
    let store = null;

    const postToServer = data => {
      const url = AppSettings.apiUrl+'/api',
        request = { method: 'POST', url, data };

      handleRequest(request, (failure, response) =>
        console.log('response', response, failure));
    }

    const submitFile = (file, callback) => {
      const complete = (json) => {
        postToServer(json)
      }
      Papa.parse(file, { complete, header: true })
    }

    const fetchCallback = (error, success) => {
      if (error) return console.log(error);
      store = success.data.map( obj => {

      })
    }

    const fetchData = () => {
      const url = `${AppSettings.apiUrl}/api`,
        request = {method: 'GET', url}

      console.log('fetching!!!');

      handleRequest(request, fetchCallback);
    }

    const queryCallback = (error, success) => {
      if (error) {
        return;
      }
      console.log('received:', success);
      return;
    }

    const queryServer = (query) => {
      const url = `${AppSettings.apiUrl}/api?objtype=${query.objType}&objnumber=${query.objId}&timestamp=${query.timestamp}`,
      request = {method: 'GET', url};

      handleRequest(request, queryCallback)
    }

    return {
      submitFile,
      fetchData,
      queryServer
    };
  });
})();
