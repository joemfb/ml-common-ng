(function() {
  'use strict';

  angular.module('ml.common')
    .factory('MLQueryBuilder', MLQueryBuilder);

  /**
   * @class MLQueryBuilder
   * @classdesc angular service for building
   * {@link http://docs.marklogic.com/guide/search-dev/structured-query structured queries}
   *
   * Designed for one-way compatibility with a subset of the official
   * {@link http://developer.marklogic.com/features/node-client-api node-client-api}
   * {@link http://docs.marklogic.com/jsdoc/queryBuilder.html query-builder};
   * queries written to {@link MLQueryBuilder} (excluding deprecated methods)
   * should work with the offical API, but not necessarily vice-versa.
   *
   * Additionally includes extension methods (on {@link MLQueryBuilder.ext}),
   * supporting various constraint queries, operator state query components,
   * and combined queries.
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
       * Creates a {@link http://docs.marklogic.com/guide/search-dev/structured-query structured query}
       * from a set of sub-queries
       * @method MLQueryBuilder#where
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#where
       *
       * @param {...Object} queries - sub queries
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query structured query}
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
       * Builds an {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_64259 `or-query`}
       * @method MLQueryBuilder#or
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#or
       *
       * @param {...Object} queries - sub queries
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_64259 or-query}
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
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_39488 `not-query`}
       * @method MLQueryBuilder#not
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#not
       *
       * @param {Object} query - sub query to be negated
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_39488 not-query}
       */
      not: function properties(query) {
        return {
          'not-query': query
        };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_30556 `document-fragment-query`}
       * @method MLQueryBuilder#documentFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#documentFragment
       *
       * @param {Object} query - sub query to be constrained to document fragments
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_30556 document-fragment-query}
       */
      documentFragment: function documentFragment(query) {
        return { 'document-fragment-query': query };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_67222 `properties-fragment-query`}
       * @method MLQueryBuilder#propertiesFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#propertiesFragment
       *
       * @param {Object} query - sub query to be constrained to properties fragments
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_67222 properties-fragment-query}
       */
      propertiesFragment: function propertiesFragment(query) {
        return { 'properties-fragment-query': query };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_53441 `locks-fragment-query`}
       * @method MLQueryBuilder#locksFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#locksFragment
       *
       * @param {Object} query - sub query to be constrained to document locks
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_53441 locks-fragment-query}
       */
      locksFragment: function locksFragment(query) {
        return { 'locks-fragment-query': query };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_94821 `directory-query`}
       * @method MLQueryBuilder#directory
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#directory
       *
       * @param {...String|Array<String>} uris - the directory URIs to query (logical OR)
       * @param {Boolean} [infinite] - whether to query into all sub-directories (defaults to `true`)
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_94821 directory-query}
       */
      directory: function directory() {
        var args = asArray.apply(null, arguments);
        var last = args[args.length - 1];
        var infinite = true;

        if ( last === true || last === false ) {
          infinite = last;
          args.pop();
        }

        // horrible hack to support an array of URIs
        if ( args.length === 1 && Array.isArray(args[0]) ) {
          args = args[0];
        }

        return {
          'directory-query': {
            'uri': args,
            'infinite': infinite
          }
        };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_27172 `document-query`}
       * @method MLQueryBuilder#document
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#document
       *
       * @param {...String} uris - document URIs to match
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_27172 document-query}
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
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_25949 `boost-query`}
       * @method MLQueryBuilder#boost
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#boost
       *
       * @param {Object} matching - matching query
       * @param {Object} boosting - boosting query
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_25949 boost-query}
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
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_56027 `term-query`}
       * @method MLQueryBuilder#term
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#term
       *
       * @param {...String} terms - terms to match (logical OR)
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_56027 term-query}
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
         * Builds a {@link http://docs.marklogic.com/guide/rest-dev/search#id_69918 combined query}
         * @memberof! MLQueryBuilder
         * @method ext.combined
         *
         * @param {Object} query - a structured query (from {@link MLQueryBuilder#where})
         * @param {String} [qtext] - a query text string, to be parsed server-side
         * @param {Object} [options] - search options
         * @return {Object} {@link http://docs.marklogic.com/guide/rest-dev/search#id_69918 combined query}
         */
        combined: function combined(query, qtext, options) {
          if ( isObject(qtext) && !options ) {
            options = qtext;
            qtext = null;
          }

          return {
            search: {
              query: query && query.query || query,
              qtext: qtext || '',
              options: options && options.options || options
            }
          };
        },

        /**
         * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_38268 `range-constraint-query`}
         * @memberof! MLQueryBuilder
         * @method ext.rangeConstraint
         *
         * @param {String} name - constraint name
         * @param {String} [operator] - operator for matching constraint to `values`; one of `LT`, `LE`, `GT`, `GE`, `EQ`, `NE` (defaults to `EQ`)
         * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
         * @param {String|Array<String>} [options] - range options: {@link http://docs.marklogic.com/guide/rest-dev/appendixa#id_84264}
         * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_38268 range-constraint-query}
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
         * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_63420 `value-constraint-query`}
         * @memberof! MLQueryBuilder
         * @method ext.valueConstraint
         *
         * @param {String} name - constraint name
         * @param {String|Number|Array<String>|Array<Number>|null} values - the values the constraint should equal (logical OR)
         * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_63420 value-constraint-query}
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
         * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_66833 `word-constraint-query`}
         * @memberof! MLQueryBuilder
         * @method ext.wordConstraint
         *
         * @param {String} name - constraint name
         * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
         * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_66833 word-constraint-query}
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
         * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_30776 `collection-constraint-query`}
         * @memberof! MLQueryBuilder
         * @method ext.collectionConstraint
         *
         * @param {String} name - constraint name
         * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
         * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_30776 collection-constraint-query}
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
         * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_28778 `custom-constraint-query`}
         * @memberof! MLQueryBuilder
         * @method ext.customConstraint
         *
         * @param {String} name - constraint name
         * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
         * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_28778 custom-constraint-query}
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
         * @param {String} type - constraint type (`'value' || 'word' || collection' || 'custom' || '*'`)
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
         * Builds an {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_45570 `operator-state` query component}
         * @memberof! MLQueryBuilder
         * @method ext.operatorState
         *
         * @param {String} name - operator name
         * @param {String} stateName - operator-state name
         * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_45570 operator-state query component}
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
