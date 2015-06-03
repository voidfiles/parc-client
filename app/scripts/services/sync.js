/* globals moment: true */
'use strict';

/*

Syncing

1. User initiates a sync, nothing has ever been downloaded,
2. User reads, archives, and deletes a few things, as actions take place they are
asynchrounsly recorded to the server.
3. User goes offline for a bit, does some actions.
4. User initiates a sync nothing is pulled down, but local changes will be uploaded.

*/

angular.module('parcAngularApp').service('ArticleSync', function ($rootScope, ParcConfig, ParcApiClient, ArticlesDB) {
  var currentState = {
    lastSync: null,
  };

  var apiClient = new ParcApiClient();

  var persistState = function () {
    ParcConfig.updateConfig({
      syncState: currentState
    });
  };

  var updateState = function (newState, persist) {
    currentState = $.extend({}, currentState, newState);
    if (persist) {
      persistState();
    }
  };

  var restoreState = function () {
    var currentConfig = ParcConfig.getConfig();
    var storedState = currentConfig.syncState;
    updateState(storedState);
  };

  var setLastSyncTime = function (time) {
    time = time || moment.utc().format();
    console.log("Updating last sync time too", moment.utc().format());
    updateState({
      lastSync: time,
    }, true);
  };

  restoreState();
  var syncBack = function (fromTime) {
    fromTime = moment(fromTime).utc();
    console.log("Finding articles modified after", fromTime.format());
    ArticlesDB.filter(function (article) {
      return fromTime.isBefore(article.date_updated);
    }).then(function (articles) {
      console.log("Modified articles", articles);
      var articleUpdates = [];
      angular.forEach(articles, function (article) {
        articleUpdates.push(apiClient.saveArticle(article).then(function () {
          return ArticlesDB.putArticle(article);
        }));
      });
    });
  };

  // Locking
  var syncing = false;
  var reservedLastSyncTime = null;

  return {
    sync: function () {
      if (syncing) {
        return;
      }

      syncing = true;
      reservedLastSyncTime = currentState.lastSync;
      var getAllArticles = apiClient.getAllArticles(50, reservedLastSyncTime);

      setLastSyncTime();

      getAllArticles.then(function () {
        return syncBack(reservedLastSyncTime);
      }, null, function (articles) {
        console.log("Syncing articles", articles);
        ArticlesDB.putArticles(articles);
      }).catch(function () {
        // Rollback sync time in the case of a failed sync
        setLastSyncTime(reservedLastSyncTime);
      }).finally(function () {
        // Always clear the syncing lock
        syncing = false;
      });

      return getAllArticles;
    },

    hasSynced: function () {
      return !!(currentState.lastSync);
    },

    isSyncing: function () {
      return syncing;
    },

    lastSyncTime: function () {
      return currentState.lastSync;
    }
  };

});
