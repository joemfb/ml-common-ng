(function() {
  'use strict';

  angular.module('ml.common')
    .factory('MLQueryBuilder', MLQueryBuilder);

  /**
   * @class MLQueryBuilder
   * @classdesc angular service for building structured queries; a subset of
   * [node-client queryBuilder](http://docs.marklogic.com/jsdoc/queryBuilder.html), plus extensions.
   */
  function MLQueryBuilder() {
    return {

      query: function query() {
        var args = asArray.apply(null, arguments);
        return {
          'query': {
            'queries': args
          }
        };
      },

      text: function text(qtext) {
        return {
          'qtext': qtext
        };
      },

      and: function and() {
        var args = asArray.apply(null, arguments);
        return {
          'and-query': {
            'queries': args
          }
        };
      },

      /**
       * @method MLQueryBuilder#or
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#or
       */
      or: function or() {
        var args = asArray.apply(null, arguments);
        return {
          'or-query': {
            'queries': args
          }
        };
      },

      /**
       * @method MLQueryBuilder#not
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#not
       */
      not: function properties(query) {
        return {
          'not-query': query
        };
      },

      /**
       * @method MLQueryBuilder#document
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#document
       */
      document: function document() {
        var args = asArray.apply(null, arguments);
        return {
          'document-query': {
            'uri': args
          }
        };
      },

      /**
       * @method MLQueryBuilder#boost
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#boost
       */
      boost: function boost(matching, boosting) {
        return {
          'boost-query': {
            'matching-query': matching,
            'boosting-query': boosting
          }
        };
      },

      range: function range(name, values) {
        values = asArray.apply(null, [values]);
        return {
          'range-constraint-query': {
            'constraint-name': name,
            'value': values
          }
        };
      },

      collection: function collection(name, values) {
        values = asArray.apply(null, [values]);
        return {
          'collection-constraint-query': {
            'constraint-name': name,
            'uri': values
          }
        };
      },

      custom: function custom(name, values) {
        values = asArray.apply(null, [values]);
        return {
          'custom-constraint-query': {
            'constraint-name': name,
            'value': values
          }
        };
      },

      constraint: function constraint(type) {
        switch(type) {
          case 'custom':
            return this.custom;
          case 'collection':
            return this.collection;
          default:
            return this.range;
        }
      },

      properties: function properties(query) {
        return { 'properties-query': query };
      },

      operator: function operator(name, stateName) {
        return {
          'operator-state': {
            'operator-name': name,
            'state-name': stateName
          }
        };
      }

    };

  }

  function asArray() {
    var args;

    if ( arguments.length === 0 ) {
      args = [];
    } else if ( arguments.length === 1) {
      if (Array.isArray( arguments[0] )) {
        args = arguments[0];
      } else {
        args = [ arguments[0] ];
      }
    } else {
      args = [].slice.call(arguments);
    }

    return args;
  }


}());
