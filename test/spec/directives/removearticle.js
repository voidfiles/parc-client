'use strict';

describe('Directive: removeArticle', function () {

  // load the directive's module
  beforeEach(angular.mock.module('parcAngularApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    element = angular.element('<remove-article></remove-article>');
    element = $compile(element)(scope);
  }));

  it('should create a clickable button', inject(function() {
    var link = element.find('a');

    expect(link.length).toBe(1);
  }));

  it('should open a modal when clicked', function() {
    var btn = element.find('a');

    // click the trashcan
    btn.find('a').click();
  });
});
