(function() {
  'use strict';

  var qb = require('marklogic/lib/query-builder.js').builder;

  angular.module('ml.common')
    .factory('MLQueryBuilder', MLQueryBuilder);

  function MLQueryBuilder() {

    function queryWrapper() {
      var whereClause = qb.where.apply(null, arguments).whereClause;
      var parsedQueries = whereClause.query.queries.filter(function(q) {
        return !!q.parsedQuery;
      });

      if ( parsedQueries.length > 1 ) {
        throw new Error('where clause includes multiple parsedQueries; only one is allowed');
      }

      if ( parsedQueries.length ) {
        whereClause.qtext = parsedQueries[0].qtext;
      }

      return whereClause;
    }

    function textWrapper(qtext) {
      return qb.parsedFrom(qtext);
    }

    return {
      ext: require('./query-builder-extensions.js'),
      // deprecated, use qb.where()
      query: queryWrapper,
      // deprecated, use qb.parsedFrom()
      text: textWrapper,

      // (un)wrapped for direct use with REST API
      where: queryWrapper,

      // imported as is
      anchor: qb.anchor,
      and: qb.and,
      andNot: qb.andNot,
      attribute: qb.attribute,
      bind: qb.bind,
      bindDefault: qb.bindDefault,
      bindEmptyAs: qb.bindEmptyAs,
      boost: qb.boost,
      box: qb.box,
      bucket: qb.bucket,
      calculateFunction: qb.calculateFunction,
      circle: qb.circle,
      collection: qb.collection,
      copyFrom: qb.copyFrom,
      lsqtQuery: qb.lsqtQuery,
      datatype: qb.datatype,
      directory: qb.directory,
      document: qb.document,
      documentFragment: qb.documentFragment,
      element: qb.element,
      extract: qb.extract,
      facet: qb.facet,
      facetOptions: qb.facetOptions,
      field: qb.field,
      fragmentScope: qb.fragmentScope,
      geoAttributePair: qb.geoAttributePair,
      geoElement: qb.geoElement,
      geoElementPair: qb.geoElementPair,
      geoOptions: qb.geoOptions,
      geoPath: qb.geoPath,
      geoProperty: qb.geoProperty,
      geoPropertyPair: qb.geoPropertyPair,
      geospatial: qb.geospatial,
      heatmap: qb.heatmap,
      jsontype: qb.jsontype,
      latlon: qb.latlon,
      locksFragment: qb.locksFragment,
      near: qb.near,
      not: qb.not,
      notIn: qb.notIn,
      pathIndex: qb.pathIndex,
      point: qb.point,
      polygon: qb.polygon,
      propertiesFragment: qb.propertiesFragment,
      property: qb.property,
      byExample: qb.byExample,
      qname: qb.qname,
      or: qb.or,
      ordered: qb.ordered,
      parseBindings: qb.parseBindings,
      parsedFrom: qb.parsedFrom,
      parseFunction: qb.parseFunction,
      period: qb.period,
      periodCompare: qb.periodCompare,
      periodRange: qb.periodRange,
      range: qb.range,
      rangeOptions: qb.rangeOptions,
      score: qb.score,
      scope: qb.scope,
      snippet: qb.snippet,
      sort: qb.sort,
      southWestNorthEast: qb.southWestNorthEast,
      suggestBindings: qb.suggestBindings,
      suggestOptions: qb.suggestOptions,
      temporalOptions: qb.temporalOptions,
      term: qb.term,
      termOptions: qb.termOptions,
      transform: qb.transform,
      value: qb.value,
      weight: qb.weight,
      word: qb.word

    };
  }
})();
