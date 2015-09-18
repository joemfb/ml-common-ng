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

    expect(query.query).toBeDefined;
    expect(query.query.queries.length).toEqual(0);

    query = qb.where(qb.and())

    expect(query.query.queries.length).toEqual(1);
  });

  it('builds an and-query with one sub-query', function() {
    var query = qb.and();
    expect(query['and-query']).toBeDefined;
    expect(query['and-query'].queries.length).toEqual(0);

    query = qb.and( qb.term('blah'));
    expect(query['and-query'].queries.length).toEqual(1);
  });

  it('builds an and-query with multiple sub-query', function() {
    var query = query = qb.and( qb.term('blah'), qb.term('blue') );

    expect(query['and-query'].queries.length).toEqual(2);
  });

  it('builds an or-query with one sub-query', function() {
    var query = qb.or( qb.term('foo') );

    expect(query['or-query']).toBeDefined();
    expect(query['or-query'].queries.length).toEqual(1);
  });

  it('builds an or-query with multiple sub-queries', function() {
    var query = qb.or( qb.term('foo'), qb.term('bar') );

    expect(query['or-query']).toBeDefined();
    expect(query['or-query'].queries.length).toEqual(2);
  });

  it('builds a not-query', function() {
    var query = qb.not( qb.term('blah') );

    expect(query['not-query']).toBeDefined();
    expect(query['not-query']['term-query']).toBeDefined();
    expect(query['not-query']['term-query'].text[0]).toEqual('blah');
  });

  it('builds a collection query with one uri', function() {
    var query = qb.collection('uri');

    expect(query['collection-query']).toBeDefined();
    expect(query['collection-query'].uri.length).toEqual(1);
    expect(query['collection-query'].uri[0]).toEqual('uri');
  });

  it('builds a collection query with multiple uris', function() {
    var query = qb.collection('uri1', 'uri2');

    expect(query['collection-query']).toBeDefined();
    expect(query['collection-query'].uri.length).toEqual(2);
    expect(query['collection-query'].uri[0]).toEqual('uri1');
    expect(query['collection-query'].uri[1]).toEqual('uri2');

    expect(query).toEqual( qb.collection(['uri1', 'uri2']) );
  });

  it('builds a directory query with one uri', function() {
    var query = qb.directory('uri');

    expect(query['directory-query']).toBeDefined();
    expect(query['directory-query'].uri.length).toEqual(1);
    expect(query['directory-query'].uri[0]).toEqual('uri');
    expect(query['directory-query'].infinite).toEqual(true);
  });

  it('builds a directory query with multiple uris', function() {
    var query = qb.directory(['uri1', 'uri2'], false);

    expect(query['directory-query']).toBeDefined();
    expect(query['directory-query'].uri.length).toEqual(2);
    expect(query['directory-query'].uri[0]).toEqual('uri1');
    expect(query['directory-query'].uri[1]).toEqual('uri2');
    expect(query['directory-query'].infinite).toEqual(false);
  });

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

  it('builds a term query with one value', function() {
    var query = qb.term('foo');

    expect(query['term-query']).toBeDefined();
    expect(query['term-query'].text.length).toEqual(1);
    expect(query['term-query'].text[0]).toEqual('foo');
  });

  it('builds a term query with multiple values', function() {
    var query = qb.term(['foo', 'bar']);

    expect(query['term-query']).toBeDefined();
    expect(query['term-query'].text.length).toEqual(2);
    expect(query['term-query'].text[0]).toEqual('foo');
    expect(query['term-query'].text[1]).toEqual('bar');
  });

  it('builds a range-constraint-query with one value', function() {
    var query = qb.ext.rangeConstraint('test', 'value');

    var oldQuery = qb.range('test', 'value');
    expect(query).toEqual(oldQuery);

    expect(query['range-constraint-query']).toBeDefined();
    expect(query['range-constraint-query']['constraint-name']).toEqual('test');
    expect(query['range-constraint-query'].value.length).toEqual(1);
    expect(query['range-constraint-query'].value[0]).toEqual('value');
    expect(query['range-constraint-query']['range-option'].length).toBe(0);
  });

  it('builds a range-constraint-query with multiple values', function() {
    var query = qb.ext.rangeConstraint('test', ['value1', 'value2']);

    var oldQuery = qb.range('test', ['value1', 'value2']);
    expect(query).toEqual(oldQuery);

    expect(query['range-constraint-query']).toBeDefined();
    expect(query['range-constraint-query']['constraint-name']).toEqual('test');
    expect(query['range-constraint-query'].value.length).toEqual(2);
    expect(query['range-constraint-query'].value[0]).toEqual('value1');
    expect(query['range-constraint-query'].value[1]).toEqual('value2');
  });

  it('builds a range-constraint-query with an operator', function() {
    var query = qb.ext.rangeConstraint('test', 'NE', 'value');

    expect(query['range-constraint-query']).toBeDefined();
    expect(query['range-constraint-query']['constraint-name']).toEqual('test');
    expect(query['range-constraint-query']['range-operator']).toEqual('NE');
    expect(query['range-constraint-query'].value.length).toEqual(1);
    expect(query['range-constraint-query'].value[0]).toEqual('value');
  });

  it('throws an error when rangeConstraint is invoked with an invalid operator', function() {
    try {
      qb.ext.rangeConstraint('test', 'ZZ', 'value');
    } catch (err) {
      expect(err).toEqual(new Error('invalid rangeConstraint query operator: ZZ'));
    }
  });

  it('builds a collection-query with one collection', function() {
    var query = qb.ext.collectionConstraint('name', 'uri');

    expect(query['collection-constraint-query']).toBeDefined();
    expect(query['collection-constraint-query']['constraint-name']).toEqual('name');
    expect(query['collection-constraint-query'].uri.length).toEqual(1);
    expect(query['collection-constraint-query'].uri[0]).toEqual('uri');
  });

  it('builds a collection-query with multiple collections', function() {
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
    expect(query['custom-constraint-query'].text.length).toEqual(1);
    expect(query['custom-constraint-query'].text[0]).toEqual('value');
  });

  it('builds a custom-constraint-query with multiple values', function() {
    var query = qb.ext.customConstraint('test', ['value1', 'value2']);

    expect(query['custom-constraint-query']).toBeDefined();
    expect(query['custom-constraint-query']['constraint-name']).toEqual('test');
    expect(query['custom-constraint-query'].text.length).toEqual(2);
    expect(query['custom-constraint-query'].text[0]).toEqual('value1');
    expect(query['custom-constraint-query'].text[1]).toEqual('value2');
  });

  it('builds a custom-constraint-query with object properties', function() {
    var query = qb.ext.customConstraint('name', qb.ext.geospatialValues(
      { latitude: 1, longitude: 2 },
      { south: 1, west: 2, north: 3, east: 4 }
    ));

    expect(query['custom-constraint-query']).toBeDefined();
    expect(query['custom-constraint-query']['constraint-name']).toEqual('name');
    expect(query['custom-constraint-query'].text).not.toBeDefined();
    expect(query['custom-constraint-query'].point).toBeDefined();
    expect(query['custom-constraint-query'].point.length).toEqual(1);
    expect(query['custom-constraint-query'].box).toBeDefined();
    expect(query['custom-constraint-query'].box.length).toEqual(1);
    expect(query['custom-constraint-query'].circle).toBeDefined();
    expect(query['custom-constraint-query'].circle.length).toEqual(0);
    expect(query['custom-constraint-query'].polygon).toBeDefined();
    expect(query['custom-constraint-query'].polygon.length).toEqual(0);
  });

  it('builds a custom-constraint-query with mixed properties', function() {
    var query = qb.ext.customConstraint(
      'name',
      { prop: 'value' },
      'blah'
    );

    expect(query['custom-constraint-query']).toBeDefined();
    expect(query['custom-constraint-query']['constraint-name']).toEqual('name');
    expect(query['custom-constraint-query'].text).toBeDefined();
    expect(query['custom-constraint-query'].text.length).toEqual(1);

  });

  it('parses geospatial values', function() {
    var values = qb.ext.geospatialValues(
      { latitude: 1, longitude: 2 },
      { south: 1, west: 2, north: 3, east: 4 },
      { point: { latitude: 1, longitude: 2 } },
      { point: { latitude: 10, longitude: 20 } },
      { radius: 100, point: { latitude: 4, longitude: 5 } },
      { ignored: true }
    );

    expect(values).toBeDefined();
    expect(values.point).toBeDefined();
    expect(values.point.length).toEqual(1);
    expect(values.box).toBeDefined();
    expect(values.box.length).toEqual(1);
    expect(values.circle).toBeDefined();
    expect(values.circle.length).toEqual(1);
    expect(values.polygon).toBeDefined();
    expect(values.polygon.length).toEqual(2);
    expect(values.ignored).not.toBeDefined();
  });

  it('builds a geospatial-constraint-query', function() {
    var query = qb.ext.geospatialConstraint('name', [
      { latitude: 1, longitude: 2 },
      { south: 1, west: 2, north: 3, east: 4 }
    ]);

    expect(query['geospatial-constraint-query']).toBeDefined();
    expect(query['geospatial-constraint-query']['constraint-name']).toEqual('name');
    expect(query['geospatial-constraint-query'].text).not.toBeDefined();
    expect(query['geospatial-constraint-query'].point).toBeDefined();
    expect(query['geospatial-constraint-query'].point.length).toEqual(1);
    expect(query['geospatial-constraint-query'].box).toBeDefined();
    expect(query['geospatial-constraint-query'].box.length).toEqual(1);
    expect(query['geospatial-constraint-query'].circle).toBeDefined();
    expect(query['geospatial-constraint-query'].circle.length).toEqual(0);
    expect(query['geospatial-constraint-query'].polygon).toBeDefined();
    expect(query['geospatial-constraint-query'].polygon.length).toEqual(0);
  });

  it('builds a geospatial-constraint-query with rest params', function() {
    var query = qb.ext.geospatialConstraint(
      'name',
      { latitude: 1, longitude: 2 },
      { south: 1, west: 2, north: 3, east: 4 }
    );

    expect(query['geospatial-constraint-query']).toBeDefined();
    expect(query['geospatial-constraint-query']['constraint-name']).toEqual('name');
    expect(query['geospatial-constraint-query'].text).not.toBeDefined();
    expect(query['geospatial-constraint-query'].point).toBeDefined();
    expect(query['geospatial-constraint-query'].point.length).toEqual(1);
    expect(query['geospatial-constraint-query'].box).toBeDefined();
    expect(query['geospatial-constraint-query'].box.length).toEqual(1);
    expect(query['geospatial-constraint-query'].circle).toBeDefined();
    expect(query['geospatial-constraint-query'].circle.length).toEqual(0);
    expect(query['geospatial-constraint-query'].polygon).toBeDefined();
    expect(query['geospatial-constraint-query'].polygon.length).toEqual(0);
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
    var query = qb.boost( qb.and(), qb.term('blah') );

    expect(query['boost-query']).toBeDefined();
    expect(query['boost-query']['matching-query']).toBeDefined();
    expect(query['boost-query']['matching-query']).toEqual( qb.and() );

    expect(query['boost-query']['boosting-query']).toBeDefined();
    expect(query['boost-query']['boosting-query']['term-query']).toBeDefined();
    expect(query['boost-query']['boosting-query']['term-query'].text[0]).toEqual('blah');
  });

  it('builds a document-fragment query', function() {
    var query = qb.documentFragment( qb.and() );

    expect(query['document-fragment-query']).toBeDefined();
    expect(query['document-fragment-query']).toEqual( qb.and() );
  });

  it('builds a properties-fragment query', function() {
    var query = qb.propertiesFragment( qb.and() );

    expect(query['properties-fragment-query']).toBeDefined();
    expect(query['properties-fragment-query']).toEqual( qb.and() );
  });

  it('builds a locks-fragment query', function() {
    var query = qb.locksFragment( qb.and() );

    expect(query['locks-fragment-query']).toBeDefined();
    expect(query['locks-fragment-query']).toEqual( qb.and() );
  });

  it('builds an operator query', function() {
    var query = qb.ext.operatorState('sort', 'date');

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
    expect(combined.search.qtext).toEqual('');
    expect(combined.search.options).toBeDefined();
    expect(combined.search.options['return-query']).toEqual(0);
  });

});
