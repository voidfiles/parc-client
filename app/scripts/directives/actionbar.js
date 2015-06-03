'use strict';

/**
 * @ngdoc directive
 * @name parcAngularApp.directive:actionBar
 * @description
 * # actionBar
 */

angular.module('parcAngularApp').controller('ActionBarCtrl', function ($scope, ArticlesDB) {
  $scope.toggleArchiveArticle = function (article) {
    article.archived = !article.archived;
    ArticlesDB.updateArticle(article).then(function (newArticle) {
      $.extend(true, article, newArticle);
    });
  };
});

angular.module('parcAngularApp').directive('actionBar', function () {
  return {
    templateUrl: 'views/partials/actionBar.html',
    restrict: 'E',
    controller: 'ActionBarCtrl'
  };
});
