'use strict';

angular.module('parcAngularApp').controller('LoginCtrl', function ($scope, $rootScope, $state, usSpinnerService, ParcConfig, ParcApiClient) {
  var connectionInfo = {
    server: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''),
    username: null,
    password: null,
  };

  var currentConfig = ParcConfig.getConfig();

  $scope.connectionInfo = angular.extend({}, connectionInfo, currentConfig.connectionInfo);

  $scope.login = function () {
    var connectionInfo = angular.extend({}, $scope.connectionInfo);
    var testClient = new ParcApiClient(connectionInfo);

    usSpinnerService.spin('login-spinner');

    testClient.hello().then(function () {
      ParcConfig.updateConfig({
        connectionInfo: connectionInfo
      });
      $state.go($rootScope.nextState || 'index');
    }, function () {
      window.alert("That information did not work");
    }).finally(function () {
      usSpinnerService.stop('login-spinner');
    });

    return false;
  };
});
