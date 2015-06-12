'use strict';

function trim(s) {
    if (typeof String.prototype.trim === 'function') {
        return String.prototype.trim.call(s);
    } else {
        return s.replace(/^[\s\xA0]+|[\s\xA0]+$/g, '');
    }
}


// annotationFactory returns a function that can be used to construct an
// annotation from a list of selected ranges.
function annotationFactory(contextEl, ignoreSelector) {
    return function (ranges) {
        var text = [],
            serializedRanges = [];

        for (var i = 0, len = ranges.length; i < len; i++) {
            var r = ranges[i];
            console.log(r);
            text.push(trim(r.text()));
            serializedRanges.push(r.serialize(contextEl, ignoreSelector));
        }

        return {
            quote: text.join(' / '),
            ranges: serializedRanges
        };
    };
}


angular.module('parcAngularApp')
  .directive('handleHighlights', function () {
    return {
      restrict: 'EA',
      link: {
        post: function (scope, element) {
          var highlighter = window.HighlighterStandalone(element.get(0));
          var makeAnnotation = annotationFactory(element.get(0), '.annotator-hl');
          var textSelector = new window.TextSelector(element.get(0), {
            onSelection: function (selections) {

              scope.article.annotation = makeAnnotation(selections);

              console.log('selections', scope.article.annotation);
              highlighter.annotationCreated(scope.article.annotation);
              console.log(scope.article.annotation);
            }
          });

          scope.$on('destroy', function () {
            textSelector.destroy();
          });
        }
      },
      scope: {
        article: "="
      }
    };
  });
