(function() {
  'use strict';

  var prefix = null;
  var defaultPrefix = '/v1';

  angular.module('ml.common')
    .provider('MLRest', function() {
      this.setPrefix = function(p) {
        if (!/^\//.test(p) || /\/$/.test(p)) {
          throw new Error('bad MLRest prefix');
        }

        prefix = p;
      };

      this.$get = ['$http', MLRest];
    });

  /**
   * @class MLRest
   * @classdesc low-level angular service, encapsulates REST API builtins and normalizes the responses.
   *
   * @param {Object} $http - angular {@link https://docs.angularjs.org/api/ng/service/$http $http service}
   */
  function MLRest($http) {
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

      if ((prefix && endpoint.indexOf(prefix) === 0) ||
          endpoint.indexOf(defaultPrefix) === 0) {
        url = endpoint;
      } else {
        url = (prefix || defaultPrefix) + endpoint;
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
    // TODO: uri param?
    // TODO: shouldn't resolve location?
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
    // TODO: shouldn't resolve location?
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

      // TODO: POST query?
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
