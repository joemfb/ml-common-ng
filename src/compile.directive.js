(function() {
  'use strict';

  /**
   * angular directive; compiles HTML strings into the DOM
   *
   *
   * Example:
   *
   * ```
   * <div compile="ctrl.stringContent"></div>```
   *
   * @namespace compile
   */

  // Copied from https://docs.angularjs.org/api/ng/service/$compile
  angular.module('ml.common')
  .directive('compile', compile);

  compile.$inject = ['$compile'];

  function compile($compile) {
    // directive factory creates a link function
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile);
        },
        function(value) {
          // when the 'compile' expression changes
          // assign it into the current DOM
          element.html(value);

          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
      );
    };
  }
})();
