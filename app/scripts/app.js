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

    $rootScope.showSortInfo = true;

    $rootScope.$on("$stateChangeStart", function (event, toState) {
        usSpinnerService.spin('spinner-1');
        var currentConfig = ParcConfig.getConfig();
        console.log("Redirecting", currentConfig);
        $rootScope.showSortInfo = !!toState.data.showSortInfo;
        // Require authentication for all pages unless data.requiresAuth = false
        if (toState.data.requiresAuth === true && !currentConfig.connectionInfo.server) {
            console.log("Redirecting to auth");
            $rootScope.nextState = toState.name;
            event.preventDefault();
            usSpinnerService.stop('spinner-1');
            $state.go('login');
        }
        console.log("Done redirecting");
    });

    $rootScope.$on('$stateNotFound', function(event, unfoundState){
        console.log(unfoundState.to); // "lazy.state"
        console.log(unfoundState.toParams); // {a:1, b:2}
        console.log(unfoundState.options); // {inherit:false} + default options
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
        console.log(error);
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
      showSortInfo: false,
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
    data: {
      showSortInfo: true,
    },
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
          article: ['$stateParams', 'ArticlesDB', function ($stateParams, ArticlesDB) {
            console.log("Getting article", $stateParams.articleId);
            return ArticlesDB.getArticle($stateParams.articleId);
          }]
        }
      }
    }
  }));

});
