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
   * @param {Object} $http - angular [$http service](https://docs.angularjs.org/api/ng/service/$http)
   */
  function MLRest($http) {
    var defaults = { apiVersion: 'v1' };

    var service = {
      search: search,
      getDocument: getDocument,
      createDocument: createDocument,
      updateDocument: updateDocument,
      patchDocument: patchDocument,
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
     * @param {Object} settings - angular `$http` service [settings](https://docs.angularjs.org/api/ng/service/$http#usage)
     * @return {Promise} a promise resolved with an angular `$http` service [response object](https://docs.angularjs.org/api/ng/service/$http#general-usage)
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
     * @param {Object} settings - angular `$http` service [settings](https://docs.angularjs.org/api/ng/service/$http#usage)
     * @return {Promise} a promise resolved with an angular `$http` service [response object](https://docs.angularjs.org/api/ng/service/$http#general-usage)
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
     * @return {Promise} a promise resolved with an angular `$http` service [response object](https://docs.angularjs.org/api/ng/service/$http#general-usage)
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
     * @return {Promise} a promise resolved with an angular `$http` service [response object](https://docs.angularjs.org/api/ng/service/$http#general-usage)
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
     * Evaluates a SPARQL query
     * - {@link http://docs.marklogic.com/REST/GET/v1/graphs/sparql}
     * @method MLRest#sparql
     *
     * @param {String} query - a SPARQL query
     * @param {Object} [params] - URL params
     * @return {Promise} a promise resolved with an angular `$http` service [response object](https://docs.angularjs.org/api/ng/service/$http#general-usage)
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
     * @return {Promise} a promise resolved with an angular `$http` service [response object](https://docs.angularjs.org/api/ng/service/$http#general-usage)
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
     * @return {Promise} a promise resolved with an angular `$http` service [response object](https://docs.angularjs.org/api/ng/service/$http#general-usage)
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
     * @return {Promise} a promise resolved with an angular `$http` service [response object](https://docs.angularjs.org/api/ng/service/$http#general-usage)
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
