'use strict';


angular.module('parcAngularApp').provider('ParcConfig', function () {
  var storedConfig = JSON.parse(localStorage.storedConfig || '{"articleParams": {}, "connectionInfo": {}}');

  var updateStoredConfig = function () {
    localStorage.storedConfig = JSON.stringify(storedConfig);
  };

  var addConfig = function (config) {
    $.extend(true, storedConfig, config);
    updateStoredConfig();
  };

  this.addConfig = addConfig;

  var configService = {
    updateConfig: function (config) {
      addConfig(config);
      this.$rootScope.$broadcast('configUpdate');
    },
    getConfig: function () {
      return $.extend({}, storedConfig);
    }
  };

  this.$get = function ($rootScope) {
    configService.$rootScope = $rootScope;
    // let's assume that the UnicornLauncher constructor was also changed to
    // accept and use the useTinfoilShielding argument
    return configService;
  };

});
