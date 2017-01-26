/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.display', [])
  .controller('DisplayCtrl', DisplayCtrl);

  function DisplayCtrl ($scope, $rootScope, services) {
    $scope.messageHeading = 'Your object will be displayed here!'
    $scope.messageBody = 'Please upload a CSV file or submit an object state query.'
    $scope.bodyClass = 'message-body';

    const displayUploaded = (data, success, response) => {

      if (!success) {
        $scope.bodyClass = 'message-body error-message';
        $scope.messageHeading = 'There was an error uploading:';
        $scope.messageBody = response;
      } else {
        $scope.bodyClass = 'message-body code'
        $scope.messageHeading = 'Your file has been successfully uploaded to the database.';
        $scope.messageBody = ':)';
      }
    }

    const displayQueried = (query, response) => {
      console.log('query:', query, 'response', response);
      $scope.objId = query.objId;
      $scope.objType = query.objType;
      $scope.time = moment(query.timestamp*1).format('MMM DD YYYY, hh:mm:ss')
      $scope.messageHeading = 'You queried the following:';
      $scope.messageBody = services.formatMessage(query, response);
    }

    const displayWarning = (key, error) => {
      $scope.messageHeading = 'OOPS!'
      if (key) {
        $scope.messageBody = `You forgot to fill out "${key}"`
      } else if (error) {
        $scope.messageBody = 'There was an error posting... Check Developer Console!'
        console.error(error);
      }
    }

    $rootScope.$on('uploaded', (status, data, success, response) => {
      return displayUploaded(data, success, response);
    })

    $rootScope.$on('queried', (status, query, response) => {
      return displayQueried(query, response);
    })

    $rootScope.$on('warning', (status, key, error) => {
      return displayWarning(key, error);
    })

  }
})();
