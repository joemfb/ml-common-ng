(function() {
  'use strict';

  /**
   * @namespace 'ml.common'
   */
  angular.module('ml.common', [])
    .filter('object2Array', object2Array)
    .filter('truncate', truncate);

  /**
   * angular filter for converting object properties to arrays
   *
   * converts `{ prop: { value: 'val' }}` to `[{ value: 'val', __key: 'prop' }]`
   *
   * @name object2Array
   * @memberof 'ml.common'
   */
  function object2Array() {
    return function(input) {
      var out = [];
      for (var name in input) {
        input[name].__key = name;
        out.push(input[name]);
      }
      return out;
    };
  }

  // jscs:disable
  /**
   * angular filter for truncating text.
   *
   * truncates to `length`, offset by the length of `end`, and concatenates with `end`.
   *
   * ex:
   *
   *   `'abcdefg' | truncate:5` returns `'ab...'` <br/>
   *   `'abcdefg' | truncate:5:''` returns `'abcde'`
   *
   * @name truncate
   * @memberof 'ml.common'
   *
   * @param {Number} length - output length (defaults to `10`)
   * @param {String} [end] - string to append to the input (defaults to `'...'`)
   */
  // jscs:enable
  function truncate() {
    return function(text, length, end) {
      length = length || 10;
      end = end || '...';

      return (text.length > length) ?
             String(text).substring(0, length - end.length) + end :
             text;
    };
  }

}());

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
  .directive('compile', function($compile) {
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
  });

})();

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

(function() {
  'use strict';

  angular.module('ml.common')
    .provider('MLRest', function() {
      this.$get = ['$http', MLRest];
    });

  /**
   * @class MLRest
   * @classdesc low-level angular service, encapsulates REST API builtins and normalizes the responses.
   *
   * @param {Object} $http - angular {@link https://docs.angularjs.org/api/ng/service/$http $http service}
   */
  function MLRest($http) {
    var defaults = { apiVersion: 'v1' };

    var service = {
      search: search,
      getDocument: getDocument,
      createDocument: createDocument,
      updateDocument: updateDocument,
      patchDocument: patchDocument,
      deleteDocument: deleteDocument,
      sparql: sparql,
      suggest: suggest,
      values: values,
      extension: extension,
      queryConfig: queryConfig,
      request: request,

      // DEPRECATED: TODO: remove
      getSearchOptions: queryConfig,
      callExtension: extension,
      patch: patchDocument
    };

    // private function for checking if a method is supported
    function isSupportedMethod(method) {
      var supported = [ 'GET', 'PUT', 'POST', 'DELETE' ];
      return supported.indexOf(method) > -1;
    }

    /**
     * Makes a REST API request (all other methods wrap this)
     * @method MLRest#request
     *
     * @param {String} endpoint - the request endpoint: can be version agnostic (`/search`) or specific (`/v1/search`)
     * @param {Object} settings - angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#usage settings}
     * @return {Promise} a promise resolved with an angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#general-usage response object}
     */
    function request(endpoint, settings) {
      var url;

      if (/^\/v1\//.test(endpoint)) {
        url = endpoint;
      } else {
        url = '/' + defaults.apiVersion + endpoint;
      }

      settings = settings || {};
      settings.method = settings.method || 'GET';

      if (!isSupportedMethod(settings.method)) {
        settings.headers = settings.headers || {};
        settings.headers['X-HTTP-Method-Override'] = settings.method;
        settings.method = 'POST';
      }

      return $http({
        url: url,
        data: settings.data,
        method: settings.method,
        params: settings.params,
        headers: settings.headers
      });
    }

    /**
     * Makes a resource extension request
     * - {@link http://docs.marklogic.com/REST/GET/v1/resources/[name]}
     * @method MLRest#extension
     *
     * @param {String} name - resource extension name
     * @param {Object} settings - angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#usage settings}
     * @return {Promise} a promise resolved with an angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#general-usage response object}
     */
    function extension(name, settings) {
      if ( !/^\//.test(name) ) {
        name = '/' + name;
      }
      return request('/resources' + name, settings);
    }

    /**
     * Makes a search request (POST if combined query, GET otherwise)
     * - {@link http://docs.marklogic.com/REST/GET/v1/search}
     * - {@link http://docs.marklogic.com/REST/POST/v1/search}
     * @method MLRest#search
     *
     * @param {Object} [options] - URL params
     * @param {Object} [combined] - a combined search object (identified by a `search` property)
     * @return {Promise} a promise resolved with an angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#general-usage response object}
     */
    function search(options, combined) {
      var settings = {};

      if ( !combined && options && options.search ) {
        combined = options;
        options = {};
      } else {
        options = options || {};
      }

      if (!options.format) {
        options.format = 'json';
      }

      settings.params = options;

      if ( combined ) {
        settings.method = 'POST';
        settings.data = combined;
      }

      return request('/search', settings);
    }

    /**
     * Retrieves a document at the specified URI
     * - {@link http://docs.marklogic.com/REST/GET/v1/documents}
     * @method MLRest#getDocument
     *
     * @param {String} uri - document URI
     * @param {Object} options - URL params
     * @return {Promise} a promise resolved with an angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#general-usage response object}
     */
    function getDocument(uri, options) {
      options = options || {};
      options.uri = uri;

      if (!options.format) {
        options.format = 'json';
      }

      return request('/documents', { params: options });
    }

    /**
     * Creates a document, returning the new URI
     * - {@link http://docs.marklogic.com/REST/POST/v1/documents}
     * @method MLRest#createDocument
     *
     * @param {Object|String} doc - document contents
     * @param {Object} [options] - URL params
     * @return {Promise} a promise resolved with the new document URI
     */
    function createDocument(doc, options) {
      return request('/documents', {
        method: 'POST',
        params: options,
        data: doc
      }).then(function(response) {
        return response.headers('location');
      });
    }

    /**
     * Creates or updates a document at the specified URI (`options.uri`)
     * - {@link http://docs.marklogic.com/REST/PUT/v1/documents}
     * @method MLRest#updateDocument
     *
     * @param {Object|String} doc - document contents
     * @param {Object} options - URL params
     * @return {Promise} a promise resolved with the new document URI
     */
    //TODO: uri param?
    //TODO: shouldn't resolve location?
    function updateDocument(doc, options) {
      return request('/documents', {
        method: 'PUT',
        params: options,
        data: doc
      }).then(function(response) {
        return response.headers('location');
      });
    }

    /**
     * Applies the provided patch to the document at the specified URI
     * - {@link http://docs.marklogic.com/REST/PATCH/v1/documents}
     * @method MLRest#patchDocument
     *
     * @param {String} uri - document URI
     * @param {Object} patch - a document patch definition
     * @return {Promise} a promise resolved with the new document URI
     */
    //TODO: shouldn't resolve location?
    function patchDocument(uri, patch) {
      // TODO: support XML patches

      // var headers = {};
      //
      // if (isObject(patch)) {
      //   headers = { 'Content-Type': 'application/json' }
      // } else {
      //   headers = { 'Content-Type': 'application/xml' }
      // }

      return request('/documents', {
        method: 'PATCH',
        params: { uri: uri },
        // headers: headers,
        data: patch
      })
      .then(function(response) {
        return response.headers('location');
      });
    }

    /**
     * Deletes a document at the specified URI
     * - {@link http://docs.marklogic.com/REST/DELETE/v1/documents}
     * @method MLRest#deleteDocument
     *
     * @param {String} uri - document uri
     * @param {Object} options - URL params
     * @return {Promise} a promise resolved with an angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#general-usage response object}
     */
    function deleteDocument(uri, options) {
      options = options || {};
      options.uri = uri;

      return request('/documents', {
        method: 'DELETE',
        params: options
      });
    }

    /**
     * Evaluates a SPARQL query
     * - {@link http://docs.marklogic.com/REST/GET/v1/graphs/sparql}
     * @method MLRest#sparql
     *
     * @param {String} query - a SPARQL query
     * @param {Object} [params] - URL params
     * @return {Promise} a promise resolved with an angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#general-usage response object}
     */
    function sparql(query, params) {
      var accept = [
        'application/sparql-results+json'
        // TODO: file bug against REST API for not supporting multiple Accept mime-types
        // 'application/rdf+json'
      ];

      params = params || {};

      //TODO: POST query?
      params.query = query;

      return request('/graphs/sparql', {
        params: params,
        headers: { 'Accept': accept.join(', ') }
      });
    }

    /**
     * Retrieves search phrase suggestions
     * - {@link http://docs.marklogic.com/REST/GET/v1/suggest}
     * - {@link http://docs.marklogic.com/REST/POST/v1/suggest}
     * @method MLRest#suggest
     *
     * @param {Object} [params] - URL params
     * @param {Object} [combined] - combined query
     * @return {Promise} a promise resolved with an angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#general-usage response object}
     */
    function suggest(params, combined) {
      var settings = { params: params };

      if (combined) {
        settings.method = 'POST';
        settings.data = combined;
      }

      return request('/suggest', settings);
    }

    /**
     * Retrieves lexicon values
     * - {@link http://docs.marklogic.com/REST/GET/v1/values/[name]}
     * - {@link http://docs.marklogic.com/REST/POST/v1/values/[name]}
     * @method MLRest#values
     *
     * @param {String} name - values definition name (from stored or combined search options)
     * @param {Object} [params] - URL params
     * @param {Object} [combined] - combined query
     * @return {Promise} a promise resolved with an angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#general-usage response object}
     */
    function values(name, params, combined) {
      var settings = { params: params };

      if (combined) {
        settings.method = 'POST';
        settings.data = combined;
      }

      return request('/values/' + name, settings);
    }

    /**
     * Retrieves stored search options
     * - {@link http://docs.marklogic.com/REST/GET/v1/config/query/['default'-or-name]}
     * - {@link http://docs.marklogic.com/REST/GET/v1/config/query/['default'-or-name]/[child-element]}
     * @method MLRest#queryConfig
     *
     * @param {String} name - stored search options name
     * @param {String} [section] - options section to retrieve
     * @return {Promise} a promise resolved with an angular `$http` service {@link https://docs.angularjs.org/api/ng/service/$http#general-usage response object}
     */
    function queryConfig(name, section) {
      var url = '/config/query/' + name;

      if (section) {
        url += '/' + section;
      }
      return request(url, {
        params: { format: 'json' }
      });
    }

    return service;
  }

}());
