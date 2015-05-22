(function() {
  'use strict';

  var qb = require('marklogic').queryBuilder,
      mlutil = require('marklogic/lib/mlutil.js');

  angular.module('ml.common')
    .factory('MLQueryBuilder', MLQueryBuilder);

  function MLQueryBuilder() {

    function queryWrapper() {
      var args = mlutil.asArray.apply(null, arguments);
      return qb.where.apply(null, args).whereClause;
    }

    function textWrapper(qtext) {
      return qb.parsedFrom(qtext);
    }

    return {

      // query: function query() {
      //   var args = asArray.apply(null, arguments);
      //   return {
      //     'query': {
      //       'queries': args
      //     }
      //   };
      // },

      // text: function text(qtext) {
      //   return {
      //     'qtext': qtext
      //   };
      // },

      // and: function and() {
      //   var args = asArray.apply(null, arguments);
      //   return {
      //     'and-query': {
      //       'queries': args
      //     }
      //   };
      // },

      // or: function or() {
      //   var args = asArray.apply(null, arguments);
      //   return {
      //     'or-query': {
      //       'queries': args
      //     }
      //   };
      // },

      // not: function properties(query) {
      //   return {
      //     'not-query': query
      //   };
      // },

      // document: function document() {
      //   var args = asArray.apply(null, arguments);
      //   return {
      //     'document-query': {
      //       'uri': args
      //     }
      //   };
      // },

      // range: function range(name, values) {
      //   values = asArray.apply(null, [values]);
      //   return {
      //     'range-constraint-query': {
      //       'constraint-name': name,
      //       'value': values
      //     }
      //   };
      // },

      // collection: function collection(name, values) {
      //   values = asArray.apply(null, [values]);
      //   return {
      //     'collection-constraint-query': {
      //       'constraint-name': name,
      //       'uri': values
      //     }
      //   };
      // },

      // custom: function custom(name, values) {
      //   values = asArray.apply(null, [values]);
      //   return {
      //     'custom-constraint-query': {
      //       'constraint-name': name,
      //       'value': values
      //     }
      //   };
      // },

      // constraint: function constraint(type) {
      //   switch(type) {
      //     case 'custom':
      //       return this.custom;
      //     case 'collection':
      //       return this.collection;
      //     default:
      //       return this.range;
      //   }
      // },

      // boost: function boost(matching, boosting) {
      //   return {
      //     'boost-query': {
      //       'matching-query': matching,
      //       'boosting-query': boosting
      //     }
      //   };
      // },

      // properties: function properties(query) {
      //   return { 'properties-query': query };
      // },

      // operator: function operator(name, stateName) {
      //   return {
      //     'operator-state': {
      //       'operator-name': name,
      //       'state-name': stateName
      //     }
      //   };
      // }

      // deprecated, use qb.where()
      query: queryWrapper,
      // deprecated, use qb.parsedFrom()
      text: textWrapper,

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

      // wraps qb.where()
      where: queryWrapper,

      word: qb.word

    };

  }

  // function asArray() {
  //   var args;

  //   if ( arguments.length === 0 ) {
  //     args = [];
  //   } else if ( arguments.length === 1) {
  //     if (Array.isArray( arguments[0] )) {
  //       args = arguments[0];
  //     } else {
  //       args = [ arguments[0] ];
  //     }
  //   } else {
  //     args = [].slice.call(arguments);
  //   }

  //   return args;
  // }

})()