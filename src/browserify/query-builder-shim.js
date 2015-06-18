(function() {
'use strict';

  var extensions = require('./query-builder-extensions.js'),
      asArray = extensions.util.asArray;

  angular.module('ml.common')
    .factory('MLQueryBuilderShim', MLQueryBuilder);

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

    function and() {
      var args = asArray.apply(null, arguments);
      return {
        'and-query': {
          'queries': args
        }
      };
    }

    function or() {
      var args = asArray.apply(null, arguments);
      return {
        'or-query': {
          'queries': args
        }
      };
    }

    function not(query) {
      return {
        'not-query': query
      };
    }

    function document() {
      var args = asArray.apply(null, arguments);
      return {
        'document-query': {
          'uri': args
        }
      };
    }

    function boost(matching, boosting) {
      return {
        'boost-query': {
          'matching-query': matching,
          'boosting-query': boosting
        }
      };
    }

    function properties(query) {
      return { 'properties-query': query };
    }

    function query() {
      var args = asArray.apply(null, arguments);
      return {
        'query': {
          'queries': args
        }
      };
    }

    function text(qtext) {
      return {
        'qtext': qtext
      };
    }
  }

})();
