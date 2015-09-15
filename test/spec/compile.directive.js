/* global describe, beforeEach, module, it, expect, inject */

describe('compile', function () {
  'use strict';

  var elem, $scope, $compile, $rootScope;

  beforeEach(module('ml.common'));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');

    $scope = $rootScope.$new();
  }));

  beforeEach(function() {
    $scope.stringContent = '<em>foo</em>'
    elem = angular.element('<div compile="stringContent"></div>');
    $compile(elem)($scope);
    $scope.$digest();
  });

  it('should compile dynamic content', function() {
    expect(elem.find('em').length).toEqual(1);
    expect(elem.find('em').text()).toEqual('foo');
  });

  it('should watch and re-compile dynamic content', function() {
    $scope.stringContent = '<i>bar</i>';
    $scope.$digest();

    expect(elem.find('em').length).toEqual(0);
    expect(elem.find('i').length).toEqual(1);
    expect(elem.find('i').text()).toEqual('bar');
  });
});
