/* globals _: true */
'use strict';

angular.module('parcAngularApp').factory('ArticlesView', function ($rootScope, ArticlesDB)  {

  var ArticlesView = {
    articles: [],
  };

  var sort = function () {
    ArticlesDB.getArticles().then(function (articles) {
      ArticlesView.articles = _.sortByOrder(articles, ['date_saved'], [false]);
    });
  };

  ArticlesDB.onUpdate().then(null, null, sort);
  sort();

  return ArticlesView;
});
