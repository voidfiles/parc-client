'use strict';


angular.module('parcAngularApp').service('ParcApiClient', function ($rootScope, $q, $http, ParcConfig)  {
  var configData = ParcConfig.getConfig();

  $rootScope.$on('configUpdate', function () {
    configData = ParcConfig.getConfig();
  });

  var ApiClient = function (opts) {
    var _this = this;

    var extendOpts = function (connectionInfo) {
       _this.opts = $.extend(connectionInfo || {}, opts);
       _this.opts.apiBase = _this.opts.server + '/api/v1';
    };

    extendOpts(configData.connectionInfo || {});

    $rootScope.$on('configUpdate', function () {
      extendOpts(ParcConfig.getConfig().connectionInfo || {});
    });

  };

  var methods = {
    fetch: function (def) {
      var deferred = $q.defer();
      var defaultDef = {
        method: 'GET',
        contentType: 'application/json',
      };

      def = $.extend({}, defaultDef, def);

      def.url = this.opts.apiBase + def.url;

      $http(def).success(function (data) {
        deferred.resolve(data);
      }).error(function (data) {
        deferred.reject(data);
      });

      var promise = deferred.promise;
      promise._then = promise.then;
      promise.then = function (done, err, notify) {
        return promise._then(function (data) {
          return done(data.meta, data.data);
        }, function (data) {
          return err(data.meta, data.data);
        }, notify);
      };

      return deferred.promise;
    },
    hello: function () {
      return this.fetch({
        url: '/hello'
      });
    },
    getArticles: function (params) {
      var defaultParams = {
        count: 20,
      };

      params = $.extend({}, defaultParams, params);

      return this.fetch({
        url: '/articles',
        params: params
      });
    },

    saveArticle: function (data) {
      return this.fetch({
        url: '/articles/' + data.id + "/",
        data: JSON.stringify(data),
        method: 'POST',
      });
    },

    getAllArticles: function (count, since) {
      var deferred = $q.defer();
      var _this = this;

      var inner = function (params) {
        _this.getArticles(params).then(function (meta, data) {
          deferred.notify(data);
          if (meta.has_more) {
            inner({before_id: meta.min_id});
          } else {
            deferred.resolve();
          }
        }, function (meta, data) {
           deferred.reject(meta, data);
        });
      };

      var params = {
        count: count || 50
      };

      if (since) {
        params.since = since;
      }

      inner(params);

      return deferred.promise;
    }
  };

  $.extend(ApiClient.prototype, methods);

  return ApiClient;

});
