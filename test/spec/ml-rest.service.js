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

});
