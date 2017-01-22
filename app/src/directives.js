/* jshint esversion: 6 */
(function() {
  angular.module('csvReader.directives', [])
  .directive('customOnChange', customOnChange);

  function customOnChange () {
    return {
      restrict: 'A',
      link: (scope, element, attrs) => {
        const onChangeHandler = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeHandler);
      }
    }

  }



})();
