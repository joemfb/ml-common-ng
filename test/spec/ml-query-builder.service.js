/* global describe, beforeEach, module, it, expect, inject */

describe('MLQueryBuilder', function () {
  'use strict';

  var qb;

  beforeEach(module('ml.common'));

  beforeEach(inject(function ($injector) {
    qb = $injector.get('MLQueryBuilder');
  }));

  it('should include node-client methods', function() {
    expect(qb.anchor).toBeDefined;
    expect(qb.and).toBeDefined;
    expect(qb.andNot).toBeDefined;
    expect(qb.attribute).toBeDefined;
    expect(qb.bind).toBeDefined;
    expect(qb.bindDefault).toBeDefined;
    expect(qb.bindEmptyAs).toBeDefined;
    expect(qb.boost).toBeDefined;
    expect(qb.box).toBeDefined;
    expect(qb.bucket).toBeDefined;
    expect(qb.calculateFunction).toBeDefined;
    expect(qb.circle).toBeDefined;
    expect(qb.collection).toBeDefined;
    expect(qb.copyFrom).toBeDefined;
    expect(qb.lsqtQuery).toBeDefined;
    expect(qb.datatype).toBeDefined;
    expect(qb.directory).toBeDefined;
    expect(qb.document).toBeDefined;
    expect(qb.documentFragment).toBeDefined;
    expect(qb.element).toBeDefined;
    expect(qb.extract).toBeDefined;
    expect(qb.facet).toBeDefined;
    expect(qb.facetOptions).toBeDefined;
    expect(qb.field).toBeDefined;
    expect(qb.fragmentScope).toBeDefined;
    expect(qb.geoAttributePair).toBeDefined;
    expect(qb.geoElement).toBeDefined;
    expect(qb.geoElementPair).toBeDefined;
    expect(qb.geoOptions).toBeDefined;
    expect(qb.geoPath).toBeDefined;
    expect(qb.geoProperty).toBeDefined;
    expect(qb.geoPropertyPair).toBeDefined;
    expect(qb.geospatial).toBeDefined;
    expect(qb.heatmap).toBeDefined;
    expect(qb.jsontype).toBeDefined;
    expect(qb.latlon).toBeDefined;
    expect(qb.locksFragment).toBeDefined;
    expect(qb.near).toBeDefined;
    expect(qb.not).toBeDefined;
    expect(qb.notIn).toBeDefined;
    expect(qb.pathIndex).toBeDefined;
    expect(qb.point).toBeDefined;
    expect(qb.polygon).toBeDefined;
    expect(qb.propertiesFragment).toBeDefined;
    expect(qb.property).toBeDefined;
    expect(qb.byExample).toBeDefined;
    expect(qb.qname).toBeDefined;
    expect(qb.or).toBeDefined;
    expect(qb.ordered).toBeDefined;
    expect(qb.parseBindings).toBeDefined;
    expect(qb.parsedFrom).toBeDefined;
    expect(qb.parseFunction).toBeDefined;
    expect(qb.period).toBeDefined;
    expect(qb.periodCompare).toBeDefined;
    expect(qb.periodRange).toBeDefined;
    expect(qb.range).toBeDefined;
    expect(qb.rangeOptions).toBeDefined;
    expect(qb.score).toBeDefined;
    expect(qb.scope).toBeDefined;
    expect(qb.snippet).toBeDefined;
    expect(qb.sort).toBeDefined;
    expect(qb.southWestNorthEast).toBeDefined;
    expect(qb.suggestBindings).toBeDefined;
    expect(qb.suggestOptions).toBeDefined;
    expect(qb.temporalOptions).toBeDefined;
    expect(qb.term).toBeDefined;
    expect(qb.termOptions).toBeDefined;
    expect(qb.transform).toBeDefined;
    expect(qb.value).toBeDefined;
    expect(qb.weight).toBeDefined;
    expect(qb.word).toBeDefined;
  });

  it('should unwrap `qb.where`', function() {
    expect(qb.where( qb.and() ).whereClause).not.toBeDefined;
  });

  it('should define extension methods', function() {
    expect(qb.ext).toBeDefined
    expect(qb.ext.rangeConstraint).toBeDefined
    expect(qb.ext.collectionConstraint).toBeDefined
    expect(qb.ext.customConstraint).toBeDefined
    expect(qb.ext.constraint).toBeDefined
    expect(qb.ext.operator).toBeDefined
  });

  it('should alias `qb.where`', function() {
    var query1 = qb.query( qb.and() );
    var query2 = qb.where( qb.and() );

    expect(query1.query).toBeDefined;
    expect(query1.query.queries.length).toEqual(1);
    expect(query1).toEqual(query2);
  });

  it('should alias `qb.parsedFrom`', function() {
    var query1 = qb.text('blah');
    var query2 = qb.parsedFrom('blah');

    expect(query1.parsedQuery.qtext).toBeDefined;
    expect(query1.parsedQuery.qtext).toEqual('blah');
    expect(query1).toEqual(query2);
  });

  it('builds a range-constraint-query with one value', function() {
    var query = qb.ext.rangeConstraint('test', 'value');

    expect(query['range-constraint-query']).toBeDefined();
    expect(query['range-constraint-query']['constraint-name']).toEqual('test');
    expect(query['range-constraint-query']['value'].length).toEqual(1);
    expect(query['range-constraint-query']['value'][0]).toEqual('value');
  });

  it('builds a range-constraint-query with multiple values', function() {
    var query = qb.ext.rangeConstraint('test', ['value1', 'value2']);

    expect(query['range-constraint-query']).toBeDefined();
    expect(query['range-constraint-query']['constraint-name']).toEqual('test');
    expect(query['range-constraint-query']['value'].length).toEqual(2);
    expect(query['range-constraint-query']['value'][0]).toEqual('value1');
    expect(query['range-constraint-query']['value'][1]).toEqual('value2');
  });

  it('builds a collection-constraint-query with one collection', function() {
    var query = qb.ext.collectionConstraint('name', 'uri');

    expect(query['collection-constraint-query']).toBeDefined();
    expect(query['collection-constraint-query']['constraint-name']).toEqual('name');
    expect(query['collection-constraint-query'].uri.length).toEqual(1);
    expect(query['collection-constraint-query'].uri[0]).toEqual('uri');
  });

  it('builds a collection-constraint-query with multiple collections', function() {
    var query = qb.ext.collectionConstraint('name', ['uri1', 'uri2']);

    expect(query['collection-constraint-query']).toBeDefined();
    expect(query['collection-constraint-query']['constraint-name']).toEqual('name');
    expect(query['collection-constraint-query'].uri.length).toEqual(2);
    expect(query['collection-constraint-query'].uri[0]).toEqual('uri1');
    expect(query['collection-constraint-query'].uri[1]).toEqual('uri2');
  });

  it('builds a custom-constraint-query with one value', function() {
    var query = qb.ext.customConstraint('test', 'value');

    expect(query['custom-constraint-query']).toBeDefined();
    expect(query['custom-constraint-query']['constraint-name']).toEqual('test');
    expect(query['custom-constraint-query']['value'].length).toEqual(1);
    expect(query['custom-constraint-query']['value'][0]).toEqual('value');
  });

  it('builds a custom-query with multiple values', function() {
    var query = qb.ext.customConstraint('test', ['value1', 'value2']);

    expect(query['custom-constraint-query']).toBeDefined();
    expect(query['custom-constraint-query']['constraint-name']).toEqual('test');
    expect(query['custom-constraint-query']['value'].length).toEqual(2);
    expect(query['custom-constraint-query']['value'][0]).toEqual('value1');
    expect(query['custom-constraint-query']['value'][1]).toEqual('value2');
  });

  it('chooses a constraint query by type', function() {
    var constraint;

    constraint = qb.ext.constraint(null)
    expect(constraint('name', 'value')['range-constraint-query']).toBeDefined;

    constraint = qb.ext.constraint('collection')
    expect(constraint('name', 'value')['collection-constraint-query']).toBeDefined;

    constraint = qb.ext.constraint('custom')
    expect(constraint('name', 'value')['custom-constraint-query']).toBeDefined;
  });

  it('builds an operator query', function() {
    var query = qb.ext.operator('sort', 'date');

    expect(query['operator-state']).toBeDefined();
    expect(query['operator-state']['operator-name']).toEqual('sort');
    expect(query['operator-state']['state-name']).toEqual('date');
  });

});
