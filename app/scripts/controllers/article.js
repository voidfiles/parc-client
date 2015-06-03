'use strict';

/**
 * @ngdoc function
 * @name parcAngularApp.controller:ArticleCtrl
 * @description
 * # ArticleCtrl
 * Controller of the parcAngularApp
 */
angular.module('parcAngularApp').controller('ArticleCtrl', function ($scope, article) {
  $scope.article = article;
});
