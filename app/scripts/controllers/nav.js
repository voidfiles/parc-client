/* globals Bloodhound: true */
'use strict';


angular.module('parcAngularApp').controller('NavCtrl', function ($rootScope, $scope, ArticleSync, ArticlesDB) {
  $rootScope.syncing = false;
  $scope.sync = function () {
    var syncing = ArticleSync.sync();
    if (!syncing) {
      return false;
    }

    $rootScope.syncing = true;

    syncing.finally(function () {
      $scope.syncing = false;
    });
  };

  $rootScope.queryView = {
    query: ArticlesDB.getCurrentSearchQuery(),
    order: 'Oldest First',
    state: 'Unread'
  };


});
