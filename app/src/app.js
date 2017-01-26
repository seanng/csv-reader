(function() {
  angular.module('csvReader', [
    'csvReader.services',
    'csvReader.directives',
    'csvReader.upload',
    'csvReader.query',
    'csvReader.display',
  ])
  .constant('AppSettings', {
    apiUrl: ''
  })
  .run((services) => {
    services.fetchData();
  })

})();
