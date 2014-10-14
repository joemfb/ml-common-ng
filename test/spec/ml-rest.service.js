/* global describe, beforeEach, module, it, expect, inject */

describe('MLRest', function () {
  'use strict';

  var mlRest, $httpBackend, $q;

  beforeEach(module('ml.common'));

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');

    mlRest = $injector.get('MLRest', $q, $httpBackend);
  }));

  it('retrieves a document', function() {
    $httpBackend
      .expectGET('/v1/documents?format=json&uri=%2Fdocs%2Ftest1.json')
      .respond('foo');

    mlRest.getDocument('/docs/test1.json').then(function(response){
      expect(response.data).toBe('foo');
    });
    $httpBackend.flush();
  });

  it('creates a document, resolves URI from header', function() {
    $httpBackend
      .expectPOST('/v1/documents')
      .respond(204, null, { 'location': "/docs/test2.json"})

    mlRest.createDocument('/docs/test2.json').then(function(location){
      expect(location).toEqual('/docs/test2.json');
    });

    $httpBackend.flush();
  });

  it('gets query config', function() {
    var options = {"options":{"concurrency-level":8, "debug":false, "page-length":10, "search-option":["score-logtfidf"], "quality-weight":1, "return-aggregates":true, "return-constraints":false, "return-facets":true, "return-frequencies":true, "return-qtext":true, "return-query":false, "return-results":true, "return-metrics":true, "return-similar":false, "return-values":true, "transform-results":{"apply":"snippet", "per-match-tokens":"30", "max-matches":"4", "max-snippet-chars":"200", "preferred-elements":""}, "searchable-expression":{"text":"fn:collection()"}, "sort-order":[{"direction":"descending", "score":null}], "term":{"apply":"term", "empty":{"apply":"all-results"}}, "grammar":{"quotation":"\"", "implicit":"<cts:and-query strength=\"20\" xmlns=\"http:\/\/marklogic.com\/appservices\/search\" xmlns:cts=\"http:\/\/marklogic.com\/cts\"\/>", "starter":[{"strength":"30", "apply":"grouping", "delimiter":")", "label":"("}, {"strength":"40", "apply":"prefix", "cts-element":"cts:not-query", "label":"-"}], "joiner":[{"strength":"10", "apply":"infix", "cts-element":"cts:or-query", "tokenize":"word", "label":"OR"}, {"strength":"20", "apply":"infix", "cts-element":"cts:and-query", "tokenize":"word", "label":"AND"}, {"strength":"30", "apply":"infix", "cts-element":"cts:near-query", "tokenize":"word", "label":"NEAR"}, {"strength":"30", "apply":"near2", "consume":"2", "cts-element":"cts:near-query", "label":"NEAR\/"}, {"strength":"32", "apply":"boost", "cts-element":"cts:boost-query", "tokenize":"word", "label":"BOOST"}, {"strength":"35", "apply":"not-in", "cts-element":"cts:not-in-query", "tokenize":"word", "label":"NOT_IN"}, {"strength":"50", "apply":"constraint", "label":":"}, {"strength":"50", "apply":"constraint", "compare":"LT", "tokenize":"word", "label":"LT"}, {"strength":"50", "apply":"constraint", "compare":"LE", "tokenize":"word", "label":"LE"}, {"strength":"50", "apply":"constraint", "compare":"GT", "tokenize":"word", "label":"GT"}, {"strength":"50", "apply":"constraint", "compare":"GE", "tokenize":"word", "label":"GE"}, {"strength":"50", "apply":"constraint", "compare":"NE", "tokenize":"word", "label":"NE"}]}}};

    $httpBackend
      .expectGET('/v1/config/query/all?format=json')
      .respond(options);

    mlRest.queryConfig('all').then(function(response){
      expect(response.data).toEqual(options);
    });

    $httpBackend
      .expectGET('/v1/config/query/all/grammer?format=json')
      .respond(options.options.grammar);

    mlRest.queryConfig('all', 'grammer').then(function(response){
      expect(response.data).toEqual(options.options.grammar);
    });

    $httpBackend
      .expectGET('/v1/config/query/all/debug?format=json')
      .respond(options.options.debug);

    mlRest.queryConfig('all', 'debug').then(function(response){
      expect(response.data).not.toBeTruthy();
    });

    $httpBackend.flush();
  });



});
