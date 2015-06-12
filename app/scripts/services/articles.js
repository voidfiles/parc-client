/* globals _: true */
'use strict';

angular.module('parcAngularApp').factory('ArticlesDB', function ($rootScope, usSpinnerService, moment, $q, $localForage)  {

  var touchArticle = function (article) {
    article.date_updated = moment.utc().format();
    console.log("Updating article.id", article.id, 'to', article.date_updated);
    return article;
  };

  var a_older_than_b = function (articleA, articleB) {
      return moment(articleA.date_updated).isBefore(articleB.date_updated);
  };

  var db = $q.defer();
  var articles = {};
  $localForage.getItem('articles').then(function(data) {
    articles = data || {};
    console.log("Got some data");
    db.resolve();
  });

  var presistArticles = function () {
    return $localForage.setItem('articles', articles);
  };

  var insertOrUpdate = function (article) {
    var currentArticle = articles[article.id];

    if (currentArticle && a_older_than_b(currentArticle, article)) {
      $.extend(true, articles[article.id], article);
    } else {
      currentArticle = articles[article.id] = article;
    }

    return currentArticle;
  };

  var dbUpdated = $q.defer();

  var ArticlesDB = {
    putArticle: function (article) {
      return db.promise.then(function () {
        var newArticle = insertOrUpdate(article);
        presistArticles();
        dbUpdated.notify([newArticle]);
        return newArticle;
      });
    },
    putArticles: function (articles) {
      return db.promise.then(function () {
        var newArticles = _.map(articles, insertOrUpdate);
        presistArticles();
        dbUpdated.notify(newArticles);
        return newArticles;
      });
    },
    getArticle: function (articleId) {
      console.log("Inside getArtile", articleId);
      return db.promise.then(function () {
        console.log("Got database returning article", articleId);
        return articles[articleId];
      });
    },
    getArticles: function () {
      return db.promise.then(function () {
        return articles;
      });
    },
    removeArticle: function (article) {
      var _this = this;
      return db.promise.then(function () {
        article.deleted = true;
        return _this.updateArticle(article);
      });
    },
    filter: function (filter_func) {
      var filteredArticles = [];
      angular.forEach(articles, function (article) {
        if (filter_func(article)) {
          filteredArticles.push(article);
        }
      });

      return $q.when(filteredArticles);
    },
    updateArticle: function (article) {
      var _this = this;
      return db.promise.then(function () {
        article = touchArticle(article);

        return _this.putArticle(article);
      });
    },
    onUpdate: function () {
      return dbUpdated.promise;
    },
    getCurrentSearchQuery: function () {

    },
  };

  return ArticlesDB;
});
