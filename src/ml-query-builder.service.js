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

    function where() {
      var args = asArray.apply(null, arguments);
      return {
        'query': {
          'queries': args
        }
      };
    }

    return {

      /**
       * @method MLQueryBuilder#query
       * @see MLQueryBuilder#where
       * @deprecated
       */
      query: function() {
        console.log(
          'Warning, MLQueryBuilder.query is deprecated, and will be removed in the next release!\n' +
          'Use MLQueryBuilder.where in it\'s place'
        );
        return this.where.apply(this, arguments);
      },

      /**
       * @method MLQueryBuilder#text
       * @deprecated
       */
      // TODO: replace with what?
      // * @see MLQueryBuilder#parsedFrom
      text: function text(qtext) {
        console.log(
          'Warning, MLQueryBuilder.text is deprecated, and will be removed in the next release!\n' +
          'Use the qtext property of a structured query in it\'s place'
        );
        return {
          'qtext': qtext
        };
      },

      /**
       * @method MLQueryBuilder#properties
       * @deprecated
       */
      properties: function properties(query) {
        console.log(
          'Warning, MLQueryBuilder.properties is deprecated, and will be removed in the next release!\n' +
          'Use MLQueryBuilder.propertiesFragment in it\'s place'
        );
        return this.propertiesFragment.apply(this, arguments);
      },

      /**
       * @method MLQueryBuilder#propertiesFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#propertiesFragment
       */
      propertiesFragment: function propertiesFragment(query) {
        return { 'properties-fragment-query': query };
      },

      /**
       * @method MLQueryBuilder#where
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#where
       */
      where: where,

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
