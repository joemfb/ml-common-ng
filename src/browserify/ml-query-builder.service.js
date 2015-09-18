(function() {
  'use strict';

  var extensions = require('./query-builder-extensions.js');
  var asArray = require('./util.js').asArray;

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
       * query builder extensions
       * @memberof MLQueryBuilder
       * @type {Object}
       */
      ext: extensions
    };
  }
}());
