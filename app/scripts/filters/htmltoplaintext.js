'use strict';

/**
 * @ngdoc filter
 * @name parcAngularApp.filter:htmlToPlaintext
 * @function
 * @description
 * # htmlToPlaintext
 * Filter in the parcAngularApp.
 */
angular.module('parcAngularApp')
  .filter('htmlToPlaintext', function () {
    return function(text) {
      return angular.element(text).text();
    };
  });
