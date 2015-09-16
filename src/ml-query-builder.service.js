(function() {
  'use strict';

  angular.module('ml.common')
    .factory('MLQueryBuilder', MLQueryBuilder);

  /**
   * @class MLQueryBuilder
   * @classdesc angular service for building structured queries; a subset of the official `node-client-api`
   * [queryBuilder](http://docs.marklogic.com/jsdoc/queryBuilder.html), plus extensions.
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
       * @see MLQueryBuilder.ext.combined
       * @deprecated
       */
      text: function text(qtext) {
        console.log(
          'Warning, MLQueryBuilder.text is deprecated, and will be removed in the next release!\n' +
          'Use the qtext argument of MLQueryBuilder.ext.combined in it\'s place'
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

      /**
       * @method MLQueryBuilder#range
       * @see MLQueryBuilder.ext.rangeConstraint
       * @deprecated
       */
      range: function range(name, values) {
        console.log(
          'Warning, MLQueryBuilder.range is deprecated, and will be removed in the next release!\n' +
          'Use MLQueryBuilder.ext.rangeConstraint in it\'s place'
        );
        return this.ext.rangeConstraint.apply(this.ext, arguments);
      },

      /**
       * @method MLQueryBuilder#collection
       * @see MLQueryBuilder.ext.collectionConstraint
       * @deprecated
       */
      collection: function collection(name, values) {
        console.log(
          'Warning, MLQueryBuilder.collection is deprecated, and will be removed in the next release!\n' +
          'Use MLQueryBuilder.ext.collectionConstraint in it\'s place'
        );
        return this.ext.collectionConstraint.apply(this.ext, arguments);
      },

      /**
       * @method MLQueryBuilder#custom
       * @see MLQueryBuilder.ext.customConstraint
       * @deprecated
       */
      custom: function custom(name, values) {
        console.log(
          'Warning, MLQueryBuilder.custom is deprecated, and will be removed in the next release!\n' +
          'Use MLQueryBuilder.ext.customConstraint in it\'s place'
        );
        return this.ext.customConstraint.apply(this.ext, arguments);
      },

      /**
       * @method MLQueryBuilder#constraint
       * @see MLQueryBuilder.ext.constraint
       * @deprecated
       */
      constraint: function constraint(type) {
        console.log(
          'Warning, MLQueryBuilder.constraint is deprecated, and will be removed in the next release!\n' +
          'Use MLQueryBuilder.ext.constraint in it\'s place'
        );
        return this.ext.constraint.apply(this.ext, arguments);
      },

      /**
       * @method MLQueryBuilder#operator
       * @see MLQueryBuilder.ext.operator
       * @deprecated
       */
      operator: function operator(name, stateName) {
        console.log(
          'Warning, MLQueryBuilder.operator is deprecated, and will be removed in the next release!\n' +
          'Use MLQueryBuilder.ext.operator in it\'s place'
        );
        return this.ext.operatorState.apply(this.ext, arguments);
      },

      /**
       * query builder extensions
       * @memberof MLQueryBuilder
       * @type {Object}
       */
      ext: {

        /**
         * Builds a [combined query](http://docs.marklogic.com/guide/rest-dev/search#id_69918)
         * @memberof! MLQueryBuilder
         * @method ext.combined
         *
         * @param {Object} query - a structured query (from {@link MLQueryBuilder#where})
         * @param {String} [qtext] - a query text string, to be parsed server-side
         * @param {Object} [options] - search options
         * @return {Object} combined query
         */
        combined: function combined(query, qtext, options) {
          if ( isObject(qtext) && !options ) {
            options = qtext;
            qtext = null;
          }

          return {
            search: {
              query: query && query.query || query,
              qtext: qtext,
              options: options && options.options || options
            }
          };
        },

        /**
         * Builds a [`range-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_38268)
         * @memberof! MLQueryBuilder
         * @method ext.rangeConstraint
         *
         * @param {String} name - constraint name
         * @param {Array} values - the values the constraint should equal (logical OR)
         * @return {Object} [range-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_38268)
         */
        rangeConstraint: function rangeConstraint(name, values) {
          values = asArray.apply(null, [values]);
          return {
            'range-constraint-query': {
              'constraint-name': name,
              'value': values
            }
          };
        },

        /**
         * Builds a [`collection-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_30776)
         * @memberof! MLQueryBuilder
         * @method ext.collectionConstraint
         *
         * @param {String} name - constraint name
         * @param {Array} values - the values the constraint should equal (logical OR)
         * @return {Object} [collection-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_30776)
         */
        collectionConstraint: function collectionConstraint(name, values) {
          values = asArray.apply(null, [values]);
          return {
            'collection-constraint-query': {
              'constraint-name': name,
              'uri': values
            }
          };
        },

        /**
         * Builds a [`custom-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_28778)
         * @memberof! MLQueryBuilder
         * @method ext.customConstraint
         *
         * @param {String} name - constraint name
         * @param {Array} values - the values the constraint should equal (logical OR)
         * @return {Object} [custom-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_28778)
         */
        customConstraint: function customConstraint(name, values) {
          values = asArray.apply(null, [values]);
          return {
            'custom-constraint-query': {
              'constraint-name': name,
              'value': values
            }
          };
        },

        /**
         * constraint query function factory
         * @memberof! MLQueryBuilder
         * @method ext.constraint
         *
         * @param {String} type - constraint type (`'collection' | 'custom' | '*'`)
         * @return {Function} a constraint query builder function, one of:
         *   - {@link MLQueryBuilder.ext.rangeConstraint}
         *   - {@link MLQueryBuilder.ext.collectionConstraint}
         *   - {@link MLQueryBuilder.ext.customConstraint}
         */
        constraint: function constraint(type) {
          switch(type) {
            case 'custom':
              return this.customConstraint;
            case 'collection':
              return this.collectionConstraint;
            default:
              return this.rangeConstraint;
          }
        },

        /**
         * Builds an [`operator-state` query component](http://docs.marklogic.com/guide/search-dev/structured-query#id_45570)
         * @memberof! MLQueryBuilder
         * @method ext.operatorState
         *
         * @param {String} name - operator name
         * @param {String} stateName - operator-state name
         * @return {Object} [operator-state component](http://docs.marklogic.com/guide/search-dev/structured-query#id_45570)
         */
        operatorState: function operatorState(name, stateName) {
          return {
            'operator-state': {
              'operator-name': name,
              'state-name': stateName
            }
          };
        }
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

  // from lodash
  function isObject(value) {
    var type = typeof value;
    return !!value && (type === 'object' || type === 'function');
  }

}());
