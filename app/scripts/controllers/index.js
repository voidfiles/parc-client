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
  var pageBy = $scope.numArticles = 50;
  var hash;

  $scope.showLoadMoreButton = true;
  $scope.articles = [];

  var setLoadMoreVisibility = function (articles) {
    if ($scope.numArticles >= articles.length) {
      $scope.showLoadMoreButton = false;
    } else {
      $scope.showLoadMoreButton = true;
    }
  };

  var sort = function () {
    console.time("Fetching articles");
    console.time("Sorting articles");
    ArticlesDB.getArticles().then(function (articles) {
      console.timeEnd("Fetching articles");
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
      var newHash = order + '' + $rootScope.queryView.query + '' + $rootScope.queryView.state;
      if (newHash !== hash) {
        $scope.numArticles = pageBy;
        hash = newHash;
      }

      setLoadMoreVisibility(sortedArticles);

      sortedArticles = _.slice(sortedArticles, 0, $scope.numArticles);

      $scope.articles = sortedArticles;
      console.timeEnd("Sorting articles");
    });
  };

  ArticlesDB.onUpdate().then(null, null, sort);

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

  $scope.myPagingFunction = function () {
    $scope.numArticles += pageBy;
    console.log("Loading more", $scope.numArticles);
    sort();
  };

  if (!ArticleSync.hasSynced()) {
    // Never synced lets do that now
    ArticleSync.sync();
  }

});
