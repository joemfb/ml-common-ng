(function() {
  'use strict';

  var qb = require('marklogic/lib/query-builder.js').builder;

  angular.module('ml.common')
    .factory('MLQueryBuilder', MLQueryBuilder);

  /**
   * @class MLQueryBuilder
   * @classdesc angular service for building structured queries; wraps the [node-client queryBuilder](http://docs.marklogic.com/jsdoc/queryBuilder.html) and includes extensions.
   */
  function MLQueryBuilder() {

    function queryWrapper() {
      var whereClause = qb.where.apply(null, arguments).whereClause;

      if ( whereClause.parsedQuery ) {
        whereClause.qtext = whereClause.parsedQuery.qtext;
        delete whereClause.parsedQuery;
      }

      return whereClause;
    }

    function textWrapper(qtext) {
      return qb.parsedFrom(qtext);
    }

    return {
      /**
       * query builder extensions
       * @memberof MLQueryBuilder
       * @type {Object}
       */
      ext: require('./query-builder-extensions.js').ext,

      /**
       * @method MLQueryBuilder#query
       * @see MLQueryBuilder#where
       * @deprecated
       */
      query: queryWrapper,

      /**
       * @method MLQueryBuilder#text
       * @see MLQueryBuilder#parsedFrom
       * @deprecated
       */
      text: textWrapper,

      /**
       * @method MLQueryBuilder#where
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#where
       */
      // (un)wrapped for direct use with REST API
      where: queryWrapper,

      // imported as is

      /**
       * @method MLQueryBuilder#anchor
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#anchor
       */
      anchor: qb.anchor,
      /**
       * @method MLQueryBuilder#and
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#and
       */
      and: qb.and,
      /**
       * @method MLQueryBuilder#andNot
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#andNot
       */
      andNot: qb.andNot,
      /**
       * @method MLQueryBuilder#attribute
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#attribute
       */
      attribute: qb.attribute,
      /**
       * @method MLQueryBuilder#bind
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#bind
       */
      bind: qb.bind,
      /**
       * @method MLQueryBuilder#bindDefault
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#bindDefault
       */
      bindDefault: qb.bindDefault,
      /**
       * @method MLQueryBuilder#bindEmptyAs
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#bindEmptyAs
       */
      bindEmptyAs: qb.bindEmptyAs,
      /**
       * @method MLQueryBuilder#boost
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#boost
       */
      boost: qb.boost,
      /**
       * @method MLQueryBuilder#box
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#box
       */
      box: qb.box,
      /**
       * @method MLQueryBuilder#bucket
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#bucket
       */
      bucket: qb.bucket,
      /**
       * @method MLQueryBuilder#calculateFunction
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#calculateFunction
       */
      calculateFunction: qb.calculateFunction,
      /**
       * @method MLQueryBuilder#circle
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#circle
       */
      circle: qb.circle,
      /**
       * @method MLQueryBuilder#collection
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#collection
       */
      collection: qb.collection,
      /**
       * @method MLQueryBuilder#copyFrom
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#copyFrom
       */
      copyFrom: qb.copyFrom,
      /**
       * @method MLQueryBuilder#lsqtQuery
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#lsqtQuery
       */
      lsqtQuery: qb.lsqtQuery,
      /**
       * @method MLQueryBuilder#datatype
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#datatype
       */
      datatype: qb.datatype,
      /**
       * @method MLQueryBuilder#directory
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#directory
       */
      directory: qb.directory,
      /**
       * @method MLQueryBuilder#document
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#document
       */
      document: qb.document,
      /**
       * @method MLQueryBuilder#documentFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#documentFragment
       */
      documentFragment: qb.documentFragment,
      /**
       * @method MLQueryBuilder#element
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#element
       */
      element: qb.element,
      /**
       * @method MLQueryBuilder#extract
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#extract
       */
      extract: qb.extract,
      /**
       * @method MLQueryBuilder#facet
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#facet
       */
      facet: qb.facet,
      /**
       * @method MLQueryBuilder#facetOptions
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#facetOptions
       */
      facetOptions: qb.facetOptions,
      /**
       * @method MLQueryBuilder#field
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#field
       */
      field: qb.field,
      /**
       * @method MLQueryBuilder#fragmentScope
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#fragmentScope
       */
      fragmentScope: qb.fragmentScope,
      /**
       * @method MLQueryBuilder#geoAttributePair
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#geoAttributePair
       */
      geoAttributePair: qb.geoAttributePair,
      /**
       * @method MLQueryBuilder#geoElement
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#geoElement
       */
      geoElement: qb.geoElement,
      /**
       * @method MLQueryBuilder#geoElementPair
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#geoElementPair
       */
      geoElementPair: qb.geoElementPair,
      /**
       * @method MLQueryBuilder#geoOptions
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#geoOptions
       */
      geoOptions: qb.geoOptions,
      /**
       * @method MLQueryBuilder#geoPath
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#geoPath
       */
      geoPath: qb.geoPath,
      /**
       * @method MLQueryBuilder#geoProperty
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#geoProperty
       */
      geoProperty: qb.geoProperty,
      /**
       * @method MLQueryBuilder#geoPropertyPair
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#geoPropertyPair
       */
      geoPropertyPair: qb.geoPropertyPair,
      /**
       * @method MLQueryBuilder#geospatial
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#geospatial
       */
      geospatial: qb.geospatial,
      /**
       * @method MLQueryBuilder#heatmap
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#heatmap
       */
      heatmap: qb.heatmap,
      /**
       * @method MLQueryBuilder#jsontype
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#jsontype
       */
      jsontype: qb.jsontype,
      /**
       * @method MLQueryBuilder#latlon
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#latlon
       */
      latlon: qb.latlon,
      /**
       * @method MLQueryBuilder#locksFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#locksFragment
       */
      locksFragment: qb.locksFragment,
      /**
       * @method MLQueryBuilder#near
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#near
       */
      near: qb.near,
      /**
       * @method MLQueryBuilder#not
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#not
       */
      not: qb.not,
      /**
       * @method MLQueryBuilder#notIn
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#notIn
       */
      notIn: qb.notIn,
      /**
       * @method MLQueryBuilder#pathIndex
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#pathIndex
       */
      pathIndex: qb.pathIndex,
      /**
       * @method MLQueryBuilder#point
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#point
       */
      point: qb.point,
      /**
       * @method MLQueryBuilder#polygon
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#polygon
       */
      polygon: qb.polygon,
      /**
       * @method MLQueryBuilder#propertiesFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#propertiesFragment
       */
      propertiesFragment: qb.propertiesFragment,
      /**
       * @method MLQueryBuilder#property
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#property
       */
      property: qb.property,
      /**
       * @method MLQueryBuilder#byExample
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#byExample
       */
      byExample: qb.byExample,
      /**
       * @method MLQueryBuilder#qname
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#qname
       */
      qname: qb.qname,
      /**
       * @method MLQueryBuilder#or
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#or
       */
      or: qb.or,
      /**
       * @method MLQueryBuilder#ordered
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#ordered
       */
      ordered: qb.ordered,
      /**
       * @method MLQueryBuilder#parseBindings
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#parseBindings
       */
      parseBindings: qb.parseBindings,
      /**
       * @method MLQueryBuilder#parsedFrom
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#parsedFrom
       */
      parsedFrom: qb.parsedFrom,
      /**
       * @method MLQueryBuilder#parseFunction
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#parseFunction
       */
      parseFunction: qb.parseFunction,
      /**
       * @method MLQueryBuilder#period
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#period
       */
      period: qb.period,
      /**
       * @method MLQueryBuilder#periodCompare
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#periodCompare
       */
      periodCompare: qb.periodCompare,
      /**
       * @method MLQueryBuilder#periodRange
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#periodRange
       */
      periodRange: qb.periodRange,
      /**
       * @method MLQueryBuilder#range
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#range
       */
      range: qb.range,
      /**
       * @method MLQueryBuilder#rangeOptions
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#rangeOptions
       */
      rangeOptions: qb.rangeOptions,
      /**
       * @method MLQueryBuilder#score
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#score
       */
      score: qb.score,
      /**
       * @method MLQueryBuilder#scope
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#scope
       */
      scope: qb.scope,
      /**
       * @method MLQueryBuilder#snippet
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#snippet
       */
      snippet: qb.snippet,
      /**
       * @method MLQueryBuilder#sort
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#sort
       */
      sort: qb.sort,
      /**
       * @method MLQueryBuilder#southWestNorthEast
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#southWestNorthEast
       */
      southWestNorthEast: qb.southWestNorthEast,
      /**
       * @method MLQueryBuilder#suggestBindings
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#suggestBindings
       */
      suggestBindings: qb.suggestBindings,
      /**
       * @method MLQueryBuilder#suggestOptions
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#suggestOptions
       */
      suggestOptions: qb.suggestOptions,
      /**
       * @method MLQueryBuilder#temporalOptions
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#temporalOptions
       */
      temporalOptions: qb.temporalOptions,
      /**
       * @method MLQueryBuilder#term
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#term
       */
      term: qb.term,
      /**
       * @method MLQueryBuilder#termOptions
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#termOptions
       */
      termOptions: qb.termOptions,
      /**
       * @method MLQueryBuilder#transform
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#transform
       */
      transform: qb.transform,
      /**
       * @method MLQueryBuilder#value
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#value
       */
      value: qb.value,
      /**
       * @method MLQueryBuilder#weight
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#weight
       */
      weight: qb.weight,
      /**
       * @method MLQueryBuilder#word
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#word
       */
      word: qb.word
    };
  }
})();
