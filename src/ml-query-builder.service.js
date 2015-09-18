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
       * @method MLQueryBuilder#documentFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#documentFragment
       */
      documentFragment: function documentFragment(query) {
        return { 'document-fragment-query': query };
      },

      /**
       * @method MLQueryBuilder#propertiesFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#propertiesFragment
       */
      propertiesFragment: function propertiesFragment(query) {
        return { 'properties-fragment-query': query };
      },

      /**
       * @method MLQueryBuilder#locksFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#locksFragment
       */
      locksFragment: function locksFragment(query) {
        return { 'locks-fragment-query': query };
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
       * @method MLQueryBuilder#term
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#term
       */
      term: function term() {
        var args = asArray.apply(null, arguments);
        return {
          'term-query': {
            'text': args
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
         * @param {String} [operator] - operator for matching constraint to `values`; one of `LT`, `LE`, `GT`, `GE`, `EQ`, `NE` (defaults to `EQ`)
         * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
         * @param {String|Array<String>} [options] - range options: {@link http://docs.marklogic.com/guide/rest-dev/appendixa#id_84264}
         * @return {Object} [range-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_38268)
         */
        rangeConstraint: function rangeConstraint(name, operator, values, options) {
          if ( !values && !options ) {
            values = operator;
            operator = null;
          }

          if ( operator && ['LT', 'LE', 'GT', 'GE', 'EQ', 'NE'].indexOf(operator) === -1 ) {
            throw new Error('invalid rangeConstraint query operator: ' + operator);
          }

          return {
            'range-constraint-query': {
              'constraint-name': name,
              'range-operator': operator || 'EQ',
              'value': asArray(values),
              'range-option': asArray(options)
            }
          };
        },

        /**
         * Builds a [`value-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_63420)
         * @memberof! MLQueryBuilder
         * @method ext.valueConstraint
         *
         * @param {String} name - constraint name
         * @param {String|Number|Array<String>|Array<Number>|null} values - the values the constraint should equal (logical OR)
         * @return {Object} [`value-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_63420)
         */
        valueConstraint: function valueConstraint(name, values) {
          var query = {
            'value-constraint-query': {
              'constraint-name': name
            }
          };

          var type;

          if (values === null) {
            type = 'null';
            values = [];
          } else {
            values = asArray(values);
            type = typeof values[0];
            type = ((type === 'string') && 'text') || type;
          }

          query['value-constraint-query'][type] = values;

          return query;
        },

        /**
         * Builds a [`word-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_66833)
         * @memberof! MLQueryBuilder
         * @method ext.wordConstraint
         *
         * @param {String} name - constraint name
         * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
         * @return {Object} [`word-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_66833)
         */
        wordConstraint: function wordConstraint(name, values) {
          return {
            'word-constraint-query': {
              'constraint-name': name,
              'text': asArray(values)
            }
          };
        },

        /**
         * Builds a [`collection-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_30776)
         * @memberof! MLQueryBuilder
         * @method ext.collectionConstraint
         *
         * @param {String} name - constraint name
         * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
         * @return {Object} [collection-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_30776)
         */
        collectionConstraint: function collectionConstraint(name, values) {
          return {
            'collection-constraint-query': {
              'constraint-name': name,
              'uri': asArray(values)
            }
          };
        },

        /**
         * Builds a [`custom-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_28778)
         * @memberof! MLQueryBuilder
         * @method ext.customConstraint
         *
         * @param {String} name - constraint name
         * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
         * @return {Object} [custom-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_28778)
         */
        customConstraint: function customConstraint(name, values) {
          return {
            'custom-constraint-query': {
              'constraint-name': name,
              'value': asArray(values)
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
         *   - {@link MLQueryBuilder.ext.valueConstraint}
         *   - {@link MLQueryBuilder.ext.wordConstraint}
         *   - {@link MLQueryBuilder.ext.collectionConstraint}
         *   - {@link MLQueryBuilder.ext.customConstraint}
         */
        constraint: function constraint(type) {
          switch(type) {
            case 'value':
              return this.valueConstraint;
            case 'word':
              return this.wordConstraint;
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

    if ( arguments.length === 1) {
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
