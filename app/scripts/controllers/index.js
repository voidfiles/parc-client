/* globals _: true */
'use strict';

/**
 * @ngdoc function
 * @name parcAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the parcAngularApp
 */
angular.module('parcAngularApp').controller('IndexCtrl', function ($rootScope, $scope, ArticlesDB, ArticleSync) {

  var sort = function () {
    ArticlesDB.getArticles().then(function (articles) {
      var order = 'Oldest First' === $rootScope.queryView.order ? true : false;

      var sortedArticles = _.sortByOrder(articles, ['date_saved'], [order]);

      if ($rootScope.queryView.query) {
        var query = $rootScope.queryView.query.toLowerCase();
        sortedArticles = _.filter(sortedArticles, function (article) {
          var title = article.title && article.title.toLowerCase();
          if (title.indexOf(query) > -1) {
            return true;
          }

          return false;
        });
      }

      if ($rootScope.queryView.state) {
        sortedArticles = _.filter(sortedArticles, function (article) {
          if ($rootScope.queryView.state === 'Unread') {
            return !article.archived;
          } else if ($rootScope.queryView.state === 'Archived') {
            return article.archived;
          } else if ($rootScope.queryView.state === 'Deleted') {
            return article.deleted;
          }
        });
      }

      $scope.articles = sortedArticles;
    });
  };

  ArticlesDB.onUpdate().then(null, null, sort);
  sort();

  $rootScope.$watch('queryView', function () {
    sort();
  }, true);
  $scope.selectedIndex = null;

  $scope.mouseEnter = function ($index) {
    $scope.selectedIndex = $index;
  };

  $scope.mouseLeave = function () {
    $scope.selectedIndex = null;
  };

  $scope.myPagingFunction = function () {};

  if (!ArticleSync.hasSynced()) {
    // Never synced lets do that now
    ArticleSync.sync();
  }

});
