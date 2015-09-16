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
    var query = qb.ext.rangeConstraint('test', 'value');

    var oldQuery = qb.range('test', 'value');
    expect(query).toEqual(oldQuery);

    expect(query['range-constraint-query']).toBeDefined();
    expect(query['range-constraint-query']['constraint-name']).toEqual('test');
    expect(query['range-constraint-query']['value'].length).toEqual(1);
    expect(query['range-constraint-query']['value'][0]).toEqual('value');
  });

  it('builds a range-query with multiple values', function() {
    var query = qb.ext.rangeConstraint('test', ['value1', 'value2']);

    var oldQuery = qb.range('test', ['value1', 'value2']);
    expect(query).toEqual(oldQuery);

    expect(query['range-constraint-query']).toBeDefined();
    expect(query['range-constraint-query']['constraint-name']).toEqual('test');
    expect(query['range-constraint-query']['value'].length).toEqual(2);
    expect(query['range-constraint-query']['value'][0]).toEqual('value1');
    expect(query['range-constraint-query']['value'][1]).toEqual('value2');
  });

  it('builds a collection-query with one collection', function() {
    var query = qb.ext.collectionConstraint('name', 'uri');

    var oldQuery = qb.collection('name', 'uri');
    expect(query).toEqual(oldQuery);

    expect(query['collection-constraint-query']).toBeDefined();
    expect(query['collection-constraint-query']['constraint-name']).toEqual('name');
    expect(query['collection-constraint-query'].uri.length).toEqual(1);
    expect(query['collection-constraint-query'].uri[0]).toEqual('uri');
  });

  it('builds a collection-query with multiple collections', function() {
    var query = qb.ext.collectionConstraint('name', ['uri1', 'uri2']);

    var oldQuery = qb.collection('name', ['uri1', 'uri2']);
    expect(query).toEqual(oldQuery);

    expect(query['collection-constraint-query']).toBeDefined();
    expect(query['collection-constraint-query']['constraint-name']).toEqual('name');
    expect(query['collection-constraint-query'].uri.length).toEqual(2);
    expect(query['collection-constraint-query'].uri[0]).toEqual('uri1');
    expect(query['collection-constraint-query'].uri[1]).toEqual('uri2');
  });

  it('builds a custom-query with one value', function() {
    var query = qb.ext.customConstraint('test', 'value');

    var oldQuery = qb.custom('test', 'value');
    expect(query).toEqual(oldQuery);

    expect(query['custom-constraint-query']).toBeDefined();
    expect(query['custom-constraint-query']['constraint-name']).toEqual('test');
    expect(query['custom-constraint-query']['value'].length).toEqual(1);
    expect(query['custom-constraint-query']['value'][0]).toEqual('value');
  });

  it('builds a custom-query with multiple values', function() {
    var query = qb.ext.customConstraint('test', ['value1', 'value2']);

    var oldQuery = qb.custom('test', ['value1', 'value2']);
    expect(query).toEqual(oldQuery);

    expect(query['custom-constraint-query']).toBeDefined();
    expect(query['custom-constraint-query']['constraint-name']).toEqual('test');
    expect(query['custom-constraint-query']['value'].length).toEqual(2);
    expect(query['custom-constraint-query']['value'][0]).toEqual('value1');
    expect(query['custom-constraint-query']['value'][1]).toEqual('value2');
  });

  it('builds a value-constraint-query with one value', function() {
    var query = qb.ext.valueConstraint('test', 'value');

    expect(query['value-constraint-query']).toBeDefined();
    expect(query['value-constraint-query']['constraint-name']).toEqual('test');
    expect(query['value-constraint-query']['text'].length).toEqual(1);
    expect(query['value-constraint-query']['text'][0]).toEqual('value');

    query = null;
    query = qb.ext.valueConstraint('test', 1);

    expect(query['value-constraint-query']).toBeDefined();
    expect(query['value-constraint-query']['constraint-name']).toEqual('test');
    expect(query['value-constraint-query']['number'].length).toEqual(1);
    expect(query['value-constraint-query']['number'][0]).toEqual(1);

    query = null;
    query = qb.ext.valueConstraint('test', null);

    expect(query['value-constraint-query']).toBeDefined();
    expect(query['value-constraint-query']['constraint-name']).toEqual('test');
    expect(query['value-constraint-query']['null'].length).toEqual(0);
  });

  it('builds a value-constraint-query with multiple values', function() {
    var query = qb.ext.valueConstraint('test', ['value1', 'value2']);

    expect(query['value-constraint-query']).toBeDefined();
    expect(query['value-constraint-query']['constraint-name']).toEqual('test');
    expect(query['value-constraint-query']['text'].length).toEqual(2);
    expect(query['value-constraint-query']['text'][0]).toEqual('value1');
    expect(query['value-constraint-query']['text'][1]).toEqual('value2');

    query = null;
    query = qb.ext.valueConstraint('test', [1, 2]);

    expect(query['value-constraint-query']).toBeDefined();
    expect(query['value-constraint-query']['constraint-name']).toEqual('test');
    expect(query['value-constraint-query']['number'].length).toEqual(2);
    expect(query['value-constraint-query']['number'][0]).toEqual(1);
    expect(query['value-constraint-query']['number'][1]).toEqual(2);
  });

  it('builds a word-constraint-query with one value', function() {
    var query = qb.ext.wordConstraint('test', 'value');

    expect(query['word-constraint-query']).toBeDefined();
    expect(query['word-constraint-query']['constraint-name']).toEqual('test');
    expect(query['word-constraint-query']['text'].length).toEqual(1);
    expect(query['word-constraint-query']['text'][0]).toEqual('value');
  });

  it('builds a word-constraint-query with multiple values', function() {
    var query = qb.ext.wordConstraint('test', ['value1', 'value2']);

    expect(query['word-constraint-query']).toBeDefined();
    expect(query['word-constraint-query']['constraint-name']).toEqual('test');
    expect(query['word-constraint-query']['text'].length).toEqual(2);
    expect(query['word-constraint-query']['text'][0]).toEqual('value1');
    expect(query['word-constraint-query']['text'][1]).toEqual('value2');
  });

  it('chooses a constraint query by type', function() {
    var constraint;

    constraint = qb.ext.constraint(null);
    expect(constraint('name', 'value')).toEqual(qb.ext.rangeConstraint('name', 'value'));

    var oldConstraint = qb.constraint(null);

    expect(constraint('name', 'value')).toEqual(oldConstraint('name', 'value'));

    constraint = qb.ext.constraint('range')
    expect(constraint('name', 'value')).toEqual(qb.ext.rangeConstraint('name', 'value'))

    constraint = qb.ext.constraint('collection');
    expect(constraint('name', 'value')).toEqual(qb.ext.collectionConstraint('name', 'value'));

    constraint = qb.ext.constraint('custom');
    expect(constraint('name', 'value')).toEqual(qb.ext.customConstraint('name', 'value'));

    constraint = qb.ext.constraint('value');
    expect(constraint('name', 'value')).toEqual(qb.ext.valueConstraint('name', 'value'));

    constraint = qb.ext.constraint('word');
    expect(constraint('name', 'value')).toEqual(qb.ext.wordConstraint('name', 'value'));
  });

  it('builds a boost query', function() {
    var query = qb.boost( qb.and(), qb.text('blah') );

    expect(query['boost-query']).toBeDefined();
    expect(query['boost-query']['matching-query']).toBeDefined();
    expect(query['boost-query']['matching-query']).toEqual( qb.and() );

    expect(query['boost-query']['boosting-query'].qtext).toEqual('blah');
  });

  it('builds a properties query', function() {
    var query = qb.propertiesFragment( qb.and() );

    var oldQuery = qb.properties( qb.and() );
    expect(query).toEqual(oldQuery);

    expect(query['properties-fragment-query']).toBeDefined();
    expect(query['properties-fragment-query']).toEqual( qb.and() );
  });

  it('builds an operator query', function() {
    var query = qb.ext.operatorState('sort', 'date');

    var oldQuery = qb.operator('sort', 'date');
    expect(query).toEqual(oldQuery);

    expect(query['operator-state']).toBeDefined();
    expect(query['operator-state']['operator-name']).toEqual('sort');
    expect(query['operator-state']['state-name']).toEqual('date');
  });

  it('builds a combined query', function() {
    var query = qb.and();

    var combined = qb.ext.combined(query, 'blah')

    expect(combined.search).toBeDefined();
    expect(combined.search.query).toEqual(query);
    expect(combined.search.qtext).toEqual('blah');
    expect(combined.search.options).toBe(undefined);

    combined = qb.ext.combined(query, 'blah', {})

    expect(combined.search).toBeDefined();
    expect(combined.search.query).toEqual(query);
    expect(combined.search.qtext).toEqual('blah');
    expect(combined.search.options).toEqual({});

    query = qb.or();
    combined = qb.ext.combined(query, {
      options: { 'return-query': 0 }
    });

    expect(combined.search).toBeDefined();
    expect(combined.search.query).toEqual(query);
    expect(combined.search.qtext).toBeNull();
    expect(combined.search.options).toBeDefined();
    expect(combined.search.options['return-query']).toEqual(0);
  });

});
