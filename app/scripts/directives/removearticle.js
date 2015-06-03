'use strict';

angular.module('parcAngularApp').controller('RemoveModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


angular.module('parcAngularApp').controller('RemoveArticleCtrl', function ($scope, $modal, ArticlesDB) {

  $scope.handleToggle = function (article) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/partials/removeArticle.html',
      controller: 'RemoveModalInstanceCtrl',
    });

    modalInstance.result.then(function () {
      ArticlesDB.removeArticle(article);
    });
  };

});

angular.module('parcAngularApp')
  .directive('removeArticle', function () {
    return {
      template: "<a class='fa fa-trash fa-fw' title='Remove' ng-click=\"handleToggle(article)\"></a>",
      restrict: 'E',
      controller: 'RemoveArticleCtrl'
    };
  });
