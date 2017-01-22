/*jshint esversion: 6*/
(function() {

  angular.module('csvReader.services', [
  ])
  .factory('services', ($http, AppSettings) => {

    let store = {
      data: null,
    };

    const getData = () => store.data;
    const setData = (json) => store.data = json;

    const postToServer = data => {
      const url = AppSettings.apiUrl+'/api',
        request = { method: 'POST', url, data};

      $http(request)
      .then( succ => {
        console.log('post success.', succ);
      })
      .catch( fail => {
        console.error(fail);
      })
    }

    const parseToJson = (text, callback) => {
      // if condition... {
        const json = Papa.parse(text, {
          header: true
        });
        setData(json);
      // postToServer(json)
        callback(json)
      // }



    }

    const submitFile = (file, callback) => {
      const reader = new FileReader;
      reader.readAsBinaryString(file);
      reader.onload = () => parseToJson(reader.result, callback);
    }


    return {
      submitFile,
      getData,
      hasData
    };
  });
})();
