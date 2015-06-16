/* global describe, beforeEach, module, it, expect, inject */

describe('MLRest', function () {
  'use strict';

  var mlRest, $httpBackend, $q, mockResults, mockOptions, mockSparqlResults, mockSuggestions, mockValues;

  //fixtures
  beforeEach(module('search-results.json'));
  beforeEach(module('sparql-results.json'));
  beforeEach(module('options-with-grammer.json'));
  beforeEach(module('suggestions.json'));
  beforeEach(module('values-response.json'));

  beforeEach(module('ml.common'));

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');

    mockResults = $injector.get('searchResults');
    mockOptions = $injector.get('optionsWithGrammer');
    mockSparqlResults = $injector.get('sparqlResults');
    mockSuggestions = $injector.get('suggestions');
    mockValues = $injector.get('valuesResponse');

    mlRest = $injector.get('MLRest', $q, $httpBackend);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should make arbitrary requests', function() {
    $httpBackend
      .expectGET('/v1/keyvalue?element=name&format=json&value=Bob')
      .respond(mockResults);

    var actual;
    mlRest.request('/v1/keyvalue', {
      params: {
        element: 'name',
        value: 'Bob',
        format: 'json'
      }
    }).then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual(mockResults);
  });

  it('should invoke extension', function() {
    $httpBackend
      .expectGET('/v1/resources/my-ext')
      .respond('bar');

    var actual;
    mlRest.extension('/my-ext').then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toBe('bar');
  });

  it('should invoke extension with slash', function() {
    $httpBackend
      .expectGET('/v1/resources/my-ext')
      .respond('bar');

    var actual;
    mlRest.extension('/my-ext').then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toBe('bar');
  });

  it('should invoke extension with params', function() {
    $httpBackend
      .expectGET('/v1/resources/my-ext?rs:blah=true')
      .respond('blahblah');

    var actual;
    mlRest.extension('my-ext', {
      params: { 'rs:blah': true }
    }).then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toBe('blahblah');
  });

  it('should get search results', function() {
    $httpBackend
      .expectGET('/v1/search?format=json')
      .respond(mockResults);

    var actual;
    mlRest.search().then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual(mockResults);
  });

  it('should get search results with params', function() {
    $httpBackend
      .expectGET('/v1/search?format=json&options=all')
      .respond(mockResults);

    var actual;
    mlRest.search({ options: 'all' }).then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual(mockResults);
  });

  it('should get XML search results', function() {
    $httpBackend
      .expectGET('/v1/search?format=xml&options=all')
      .respond('<results/>');

    var actual;
    mlRest.search({
      format: 'xml',
      options: 'all'
    }).then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual('<results/>');
  });

  it('retrieves a document', function() {
    $httpBackend
      .expectGET('/v1/documents?format=json&uri=%2Fdocs%2Ftest1.json')
      .respond({foo: 'bar'});

    var actual;
    mlRest.getDocument('/docs/test1.json').then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual.foo).toEqual('bar');
  });

  it('should get a document with params', function() {
    $httpBackend
      .expectGET('/v1/documents?format=text&uri=%2Fdocs%2Ftest1.txt')
      .respond('foo');

    var actual;
    mlRest.getDocument('/docs/test1.txt', {
      format: 'text'
    }).then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toBe('foo');
  });

  it('creates a document, resolves URI from header', function() {
    $httpBackend
      .expectPOST('/v1/documents')
      .respond(204, null, { 'location': '/docs/test2.json'});

    mlRest.createDocument('/docs/test2.json').then(function(location){
      expect(location).toEqual('/docs/test2.json');
    });

    $httpBackend.flush();
  });

  // TODO: should this respond with location header ???
  it('should update document', function() {
    $httpBackend
      .expectPUT('/v1/documents?uri=%2Fdocs%2Ftest2.json')
      .respond(204, null, { 'location': '/docs/test2.json'});

    mlRest.updateDocument({
      contents: 'updated'
    }, {
      uri: '/docs/test2.json',
    }).then(function(location){
      expect(location).toEqual('/docs/test2.json');
    });

    $httpBackend.flush();
  });

  it('should patch document', function() {
    $httpBackend
      .expectPOST('/v1/documents?uri=%2Fdocs%2Ftest2.json')
      .respond(204, null);

    var counter = 0;

    mlRest.patchDocument('/docs/test2.json', {
      patch: [{
        insert: {
          context: '/parent',
          position: 'last-child',
          content: { child: 'inserted' }
        }
      }]
    }).then(function() { counter++; });

    $httpBackend.flush();

    expect(counter).toEqual(1);
  });

  it('should evaluate SPARQL', function() {
    $httpBackend
      .expectGET('/v1/graphs/sparql?query=select+%3Fs+%3Fp+%3Fo+where+%7B+%3Fs+%3Fp+%3Fo+%7D+limit+10')
      .respond(mockSparqlResults);

    var actual;
    mlRest.sparql(
      'select ?s ?p ?o ' +
      'where { ?s ?p ?o } ' +
      'limit 10'
    ).then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual(mockSparqlResults);
  });

  it('should get suggestions', function() {
    $httpBackend
      .expectGET('/v1/suggest?format=json&partial-q=val')
      .respond(mockSuggestions);

    var actual;

    mlRest.suggest({
      'partial-q': 'val',
      format: 'json'
    }).then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual(mockSuggestions);
  });

  it('should get suggestions with query', function() {
    $httpBackend
        .expectPOST('/v1/suggest?format=json&partial-q=val')
        .respond(mockSuggestions);

    var actual;

    mlRest.suggest({
      'partial-q': 'val',
      format: 'json'
    }, {
      search: {
        query: { 'and-query': { queries: [] } }
      }
    }).then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual(mockSuggestions);
  });

  it('should get values', function() {
    $httpBackend
      .expectGET('/v1/values/MyFacetName')
      .respond(mockValues);

    var actual;
    mlRest.values('MyFacetName').then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual(mockValues);
    // throw "error";
  });

  it('should get values with query', function() {
    $httpBackend
      .expectPOST('/v1/values/MyFacetName')
      .respond(mockValues);

    var actual;
    mlRest.values('MyFacetName', null, {
      search: {
        query: { 'and-query': { queries: [] } }
      }
    }).then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual(mockValues);
    // throw "error";
  });

  it('gets query config', function() {
    $httpBackend
      .expectGET('/v1/config/query/all?format=json')
      .respond(mockOptions);

    var actual;
    mlRest.queryConfig('all').then(function(response) { actual = response.data; });
    $httpBackend.flush();

    expect(actual).toEqual(mockOptions);
  });

  it('should get query config section', function() {
    $httpBackend
      .expectGET('/v1/config/query/all/grammer?format=json')
      .respond(mockOptions.options.grammar);

    $httpBackend
      .expectGET('/v1/config/query/all/debug?format=json')
      .respond(mockOptions.options.debug);

    var actual1, actual2;
    mlRest.queryConfig('all', 'grammer').then(function(response) { actual1 = response.data; });
    mlRest.queryConfig('all', 'debug').then(function(response) { actual2 = response.data; });
    $httpBackend.flush();

    expect(actual1).toEqual(mockOptions.options.grammar);
    expect(actual2).not.toBeTruthy();
  });

});
