(function() {
  angular.module('csvReader', [
    'csvReader.directives',
    'csvReader.services',
    'csvReader.upload',
    'csvReader.query',
    'csvReader.display',
  ])
  .constant('AppSettings', {
    apiUrl: ''
  })

})();
