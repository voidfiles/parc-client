'use strict';

var ParcAngularApp = angular.module('parcAngularApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ui.router',
  'angularSpinner',
  'ui.bootstrap',
  'vs-repeat',
  'angularMoment',
  'LocalForageModule',
  'siyfion.sfTypeahead'
]);

ParcAngularApp.run(function ($rootScope, $location, $state, usSpinnerService, ParcConfig) {

    usSpinnerService.spin('spinner-1');

    $rootScope.config = ParcConfig.getConfig();

    $rootScope.$on('configUpdate', function () {
      $.extend(true, $rootScope.config, ParcConfig.getConfig());
    });

    $rootScope.$on("$stateChangeStart", function (event, toState) {
        usSpinnerService.spin('spinner-1');
        var currentConfig = ParcConfig.getConfig();
        // Require authentication for all pages unless data.requiresAuth = false
        if (toState.data.requiresAuth === true && !currentConfig.connectionInfo.server) {
            $rootScope.nextState = toState.name;
            event.preventDefault();
            usSpinnerService.stop('spinner-1');
            $state.go('login');
        }

    });

    $rootScope.$on("$stateChangeSuccess", function () {
      usSpinnerService.stop('spinner-1');
    });
});

ParcAngularApp.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

ParcAngularApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise("/");
  $locationProvider.html5Mode(true);

  var defaultState = {
    data: {
      requiresAuth: true,
      requiresDb: true,
    },
    views: {
      header: {
        templateUrl: "views/partials/header.html",
        controller: "NavCtrl"
      },
    }
  };

  var buildState = function (state) {
    return $.extend(true, {}, defaultState, state);
  };

  $stateProvider.state('index', buildState({
    url: "/",
    views: {
      "main": {
        templateUrl: "views/index.html",
        controller: "IndexCtrl"
      }
    }
  }));

  $stateProvider.state('login', buildState({
    url: "/login",
    data: {
      requiresAuth: false,
    },
    views: {
      "main": {
        templateUrl: "views/login.html",
        controller: 'LoginCtrl',
      }
    }
  }));

  $stateProvider.state('article', buildState({
    url: "/article/:articleId/",
    views: {
      "main": {
        templateUrl: "views/article.html",
        controller: 'ArticleCtrl',
        resolve: {
          article: function ($stateParams, ArticlesDB) {
            return ArticlesDB.getArticle($stateParams.articleId);
          }
        }
      }
    }
  }));

});
