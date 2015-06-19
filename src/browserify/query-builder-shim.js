(function() {
'use strict';

  var extensions = require('./query-builder-extensions.js'),
      asArray = extensions.util.asArray;

  angular.module('ml.common')
    .factory('MLQueryBuilderShim', MLQueryBuilder);

  /**
   * @class MLQueryBuilderShim
   * @classdesc minimal angular service for building structured queries; included as an alternative to {@link MLQueryBuilder}, which is much larger.
   *
   * included in `dist/ml-common-ng-shim.js` and `dist/ml-common-ng-shim.min.js`
   */
  function MLQueryBuilder() {

    return {
      ext: extensions.ext,
      and: and,
      or: or,
      not: not,
      document: document,
      boost: boost,
      // (propertiesFragment)
      properties: properties,
      // where
      query: query,
      // parsedFrom
      text: text
    };

    /**
     * @method MLQueryBuilderShim#and
     */
    function and() {
      var args = asArray.apply(null, arguments);
      return {
        'and-query': {
          'queries': args
        }
      };
    }

    /**
     * @method MLQueryBuilderShim#or
     */
    function or() {
      var args = asArray.apply(null, arguments);
      return {
        'or-query': {
          'queries': args
        }
      };
    }

    /**
     * @method MLQueryBuilderShim#not
     */
    function not(query) {
      return {
        'not-query': query
      };
    }

    /**
     * @method MLQueryBuilderShim#document
     */
    function document() {
      var args = asArray.apply(null, arguments);
      return {
        'document-query': {
          'uri': args
        }
      };
    }

    /**
     * @method MLQueryBuilderShim#boost
     */
    function boost(matching, boosting) {
      return {
        'boost-query': {
          'matching-query': matching,
          'boosting-query': boosting
        }
      };
    }

    /**
     * @method MLQueryBuilderShim#properties
     */
    function properties(query) {
      return { 'properties-query': query };
    }

    /**
     * @method MLQueryBuilderShim#query
     */
    function query() {
      var args = asArray.apply(null, arguments);
      return {
        'query': {
          'queries': args
        }
      };
    }

    /**
     * @method MLQueryBuilderShim#text
     */
    function text(qtext) {
      return {
        'qtext': qtext
      };
    }
  }

})();
