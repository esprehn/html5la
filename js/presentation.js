(function(module) {

module.controller('PresentationController', PresentationController);
function PresentationController($scope, $location, url) {
  var ANIMATION_DURATION = 0.5;

  $scope.totalSlides = 0;
  $scope.activeSlide = -1;

  $scope.$watch('activeSlide', function(value) {
    if (value == -1) {;
      url.set('/', ANIMATION_DURATION);
    } else if (value > -1) {
      url.set('/slides/' + (value + 1), ANIMATION_DURATION);
    }
  });

  $scope.$watch(function() { return $location.url(); }, function(value) {
    var match = /\/slides\/(\d+)/.exec(value);
    if (match) {
      $scope.activeSlide = parseInt(match[1], 10) - 1;
    }
  });

  $scope.next = function() {
    $scope.activeSlide++;
  };

  $scope.previous = function() {
    $scope.activeSlide--;
  };

  $scope.isInside = function() {
    return !this.isBefore() && !this.isAfter();
  };

  $scope.isBefore = function() {
    return $scope.activeSlide < 0;
  };

  $scope.isAfter = function() {
    return $scope.activeSlide >= $scope.totalSlides;
  };
};

})(angular.module('PresentationModule', ['DomModule']));