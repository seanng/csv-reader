/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.upload', [])
  .controller('UploadCtrl', UploadCtrl);

  function UploadCtrl ($scope, $rootScope, services) {

    $scope.selectFile = (evt) => {
      $scope.file = evt.target.files[0];
      $scope.$apply(() => $scope.fileSelected = true);
    }

    const submitComplete = (store) => $rootScope.$broadcast('newSubmission', store);

    $scope.submitFile = () => services.submitFile($scope.file, submitComplete);

  }



})();
