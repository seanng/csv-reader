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
  .filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    }
  }])

})();
