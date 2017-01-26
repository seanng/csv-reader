(function() {
  angular.module('csvReader.services.request', [])
  .factory('handleRequest', ($http) => {

    const handleRequest = (request, callback) => {
      $http(request)
      .then( response => {
        console.log('helloooo')
        return callback(null, response);
      })
      .catch( failure => {
        return callback(failure);
      })
    }

    return handleRequest;
  })
})()