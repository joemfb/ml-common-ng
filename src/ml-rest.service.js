(function () {
  'use strict';

  angular.module('ml.common', [])
    .provider('MLRest', function() {
        this.$get = ['$q', '$http', MLRest];
    });

  /**
   *  MLRest
   *
   *  low-level angular service, encapsulates REST API builtins and normalizes the responses.
   *
   */

  function MLRest($q, $http) {
    var defaults = {
          apiVersion: 'v1'
        },
        service = {};


    service = {
      search: search,
      getDocument: getDocument,
      createDocument: createDocument,
      updateDocument: updateDocument,
      patchDocument: patchDocument,
      sparql: sparql,
      extension: extension,
      getSearchOptions: getSearchOptions,
      request: request,

      // DEPRECATED: TODO: remove
      callExtension: request,
      patch: patchDocument
    };

    // private function for checking if a method is supported
    function isSupportedMethod(method) {
      var supported = [ 'GET', 'PUT', 'POST', 'DELETE' ];
      return supported.indexOf(method) > -1;
    }

    function request(endpoint, settings) {
      var url;

      if (/^\/v1\//.test(endpoint)) {
        url = endpoint;
      } else {
        url = '/' + defaults.apiVersion + endpoint;
      }

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

    function extension(name, settings) {
      if ( !/^\//.test(name) ) {
        name = '/' + name;
      }
      return request('/resources' + name, settings);
    }

    function search(options) {
      var d = $q.defer();

      options = options || {};

      if (!options.format){
        options.format = 'json';
      }

      request('/search', {
        params: options
      }).then(
        function(response) {
          d.resolve(response.data);
        },
        function(reason) {
          d.reject(reason);
        });

      return d.promise;
    }

    function getDocument(uri, options) {
      options = options || {};
      options.uri = uri;

      if (!options.format){
        options.format = 'json';
      }

      return request('/documents', { params: options });
    }

    function createDocument(doc, options) {
      return request('/documents', {
        method: 'POST',
        params: options,
        data: doc
      });
    }

    //TODO: uri param?
    function updateDocument(doc, options) {
      var d = $q.defer();

      request('/documents', {
        method: 'PUT',
        params: options,
        data: doc
      }).then(
        function(data, status, headers) {
          d.resolve(headers('location'));
        },
        function(reason) {
          d.reject(reason);
        });

      return d.promise;
    }

    function patchDocument(uri, patch) {
      var d = $q.defer(),
          headers = {};

      // TODO: support XML patches
      // if (_.isObject(patch)) {
      //   headers = { 'Content-Type': 'application/json' }
      // } else {
      //   headers = { 'Content-Type': 'application/xml' }
      // }

      request('/documents', {
        method: 'PATCH',
        params: { uri: uri },
        data: patch,
        headers: headers
      })
      .then(
        function(data, status, headers) {
          d.resolve(headers('location'));
        },
        function(reason) {
          d.reject(reason);
        });

      return d.promise;
    }

    function sparql(query, format) {
      if (format !== 'application/rdf+json') {
        format = 'application/sparql-results+json';
      }

      return request('/graphs/sparql', {
        params: { query: query },
        headers: { 'Accept': format }
      });
    }

    function getSearchOptions(name) {
      return request('/config/query/' + name, {
        params: { format: 'json' }
      });
    }

    return service;
  }

}());
