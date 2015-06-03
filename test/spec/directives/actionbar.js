'use strict';

describe('Directive: actionBar', function () {

  // load the directive's module
  beforeEach(angular.mock.module('parcAngularApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    element = angular.element('<action-bar></action-bar>');
    element = $compile(element)(scope);
  }));

  it('should have three clickable-links', inject(function() {
    var links = element.find('li a');

    expect(links.length).toBe(3);
  }));

});
