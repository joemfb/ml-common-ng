/* global describe, beforeEach, module, it, expect, inject */

describe('MLQueryBuilder', function () {
  'use strict';

  var qb;

  beforeEach(module('ml.common'));

  beforeEach(inject(function ($injector) {
    qb = $injector.get('MLQueryBuilder');
  }));

  it('builds a query', function() {
    var query = qb.where();

    var oldQuery = qb.query();
    expect(query).toEqual(oldQuery);

    expect(query.query).toBeDefined;
    expect(query.query.queries.length).toEqual(0);

    query = qb.where(qb.and())
    oldQuery = qb.query(qb.and())

    expect(query.query.queries.length).toEqual(1);
  });

  it('builds a text query', function() {
    var query = qb.text('blah');
    expect(query.qtext).toBeDefined;
    expect(query.qtext).toEqual('blah');
  });

  it('builds an and-query with one sub-query', function() {
    var query = qb.and();
    expect(query['and-query']).toBeDefined;
    expect(query['and-query'].queries.length).toEqual(0);

    query = qb.and( qb.text('blah'));
    expect(query['and-query'].queries.length).toEqual(1);
  });

  it('builds an and-query with multiple sub-query', function() {
    var query = query = qb.and( qb.text('blah'), qb.text('blue') );

    expect(query['and-query'].queries.length).toEqual(2);
  });

  it('builds an or-query with one sub-query', function() {
    var query = qb.or( qb.text('foo') );

    expect(query['or-query']).toBeDefined();
    expect(query['or-query'].queries.length).toEqual(1);
  });

  it('builds an or-query with multiple sub-queries', function() {
    var query = qb.or( qb.text('foo'), qb.text('bar') );

    expect(query['or-query']).toBeDefined();
    expect(query['or-query'].queries.length).toEqual(2);
  });

  it('builds a not-query', function() {
    var query = qb.not( qb.text('blah') );

    expect(query['not-query']).toBeDefined();
    expect(query['not-query'].qtext).toEqual('blah');
  });

  // Document query
  it('builds a document query with one document', function() {
    var query = qb.document('uri');

    expect(query['document-query']).toBeDefined();
    expect(query['document-query'].uri.length).toEqual(1);
    expect(query['document-query'].uri[0]).toEqual('uri');
  });

  it('builds a document query with multiple documents', function() {
    var query = qb.document(['uri1', 'uri2']);

    expect(query['document-query']).toBeDefined();
    expect(query['document-query'].uri.length).toEqual(2);
    expect(query['document-query'].uri[0]).toEqual('uri1');
    expect(query['document-query'].uri[1]).toEqual('uri2');
  });

  it('builds a range-query with one value', function() {
    var query = qb.range('test', 'value');

    expect(query['range-constraint-query']).toBeDefined();
    expect(query['range-constraint-query']['constraint-name']).toEqual('test');
    expect(query['range-constraint-query']['value'].length).toEqual(1);
    expect(query['range-constraint-query']['value'][0]).toEqual('value');
  });

  it('builds a range-query with multiple values', function() {
    var query = qb.range('test', ['value1', 'value2']);

    expect(query['range-constraint-query']).toBeDefined();
    expect(query['range-constraint-query']['constraint-name']).toEqual('test');
    expect(query['range-constraint-query']['value'].length).toEqual(2);
    expect(query['range-constraint-query']['value'][0]).toEqual('value1');
    expect(query['range-constraint-query']['value'][1]).toEqual('value2');
  });

  it('builds a collection-query with one collection', function() {
    var query = qb.collection('name', 'uri');

    expect(query['collection-constraint-query']).toBeDefined();
    expect(query['collection-constraint-query']['constraint-name']).toEqual('name');
    expect(query['collection-constraint-query'].uri.length).toEqual(1);
    expect(query['collection-constraint-query'].uri[0]).toEqual('uri');
  });

  it('builds a collection-query with multiple collections', function() {
    var query = qb.collection('name', ['uri1', 'uri2']);

    expect(query['collection-constraint-query']).toBeDefined();
    expect(query['collection-constraint-query']['constraint-name']).toEqual('name');
    expect(query['collection-constraint-query'].uri.length).toEqual(2);
    expect(query['collection-constraint-query'].uri[0]).toEqual('uri1');
    expect(query['collection-constraint-query'].uri[1]).toEqual('uri2');
  });

  it('builds a custom-query with one value', function() {
    var query = qb.custom('test', 'value');

    expect(query['custom-constraint-query']).toBeDefined();
    expect(query['custom-constraint-query']['constraint-name']).toEqual('test');
    expect(query['custom-constraint-query']['value'].length).toEqual(1);
    expect(query['custom-constraint-query']['value'][0]).toEqual('value');
  });

  it('builds a custom-query with multiple values', function() {
    var query = qb.custom('test', ['value1', 'value2']);

    expect(query['custom-constraint-query']).toBeDefined();
    expect(query['custom-constraint-query']['constraint-name']).toEqual('test');
    expect(query['custom-constraint-query']['value'].length).toEqual(2);
    expect(query['custom-constraint-query']['value'][0]).toEqual('value1');
    expect(query['custom-constraint-query']['value'][1]).toEqual('value2');
  });

  it('chooses a constraint query by type', function() {
    var constraint;

    constraint = qb.constraint(null)
    expect(constraint('name', 'value')).toEqual(qb.range('name', 'value'))

    constraint = qb.constraint('collection')
    expect(constraint('name', 'value')).toEqual(qb.collection('name', 'value'))

    constraint = qb.constraint('custom')
    expect(constraint('name', 'value')).toEqual(qb.custom('name', 'value'))
  });

  it('builds a boost query', function() {
    var query = qb.boost( qb.and(), qb.text('blah') );

    expect(query['boost-query']).toBeDefined();
    expect(query['boost-query']['matching-query']).toBeDefined();
    expect(query['boost-query']['matching-query']).toEqual( qb.and() );

    expect(query['boost-query']['boosting-query'].qtext).toEqual('blah');
  });

  it('builds a properties query', function() {
    var query = qb.properties( qb.and() );

    expect(query['properties-query']).toBeDefined();
    expect(query['properties-query']).toEqual( qb.and() );
  });

  it('builds an operator query', function() {
    var query = qb.operator('sort', 'date');

    expect(query['operator-state']).toBeDefined();
    expect(query['operator-state']['operator-name']).toEqual('sort');
    expect(query['operator-state']['state-name']).toEqual('date');
  });

});
