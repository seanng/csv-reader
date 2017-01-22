/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.upload', [])
  .controller('UploadCtrl', UploadCtrl);

  function UploadCtrl ($scope, $rootScope, services) {

    const submitComplete = (store) => $rootScope.$broadcast('newSubmission', store);

    $scope.selectFile = (evt) => {
      $scope.file = evt.target.files[0];
      $scope.$apply(() => $scope.fileSelected = true);
    }

    $scope.submitFile = () => services.submitFile($scope.file, submitComplete);

  }



})();
