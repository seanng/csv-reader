(function() {
  angular.module('csvReader.services.request', [])
  .factory('handleRequest', ($http) => {

    const handleRequest = (request, callback) => {
      $http(request)
      .then( response => callback(null, response))
      .catch( failure => callback(failure));
    }

    return handleRequest;
  })
})()