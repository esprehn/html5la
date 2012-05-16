(function(module) {

module.controller('PresentationController', PresentationController);
function PresentationController($scope, $location) {

  $scope.$watch('activeSlide', function(value) {
    if (value == -1) {
      $location.url('');
    } else if (value > -1) {
      $location.url('/slides/' + (value + 1));
    }
  });

  $scope.$watch(function() { return $location.url(); }, function(value) {
    var match = /\/slides\/(\d+)/.exec(value);
    if (match) {
      $scope.activeSlide = parseInt(match[1], 10) - 1;
    } else if (value == '/slides/end') {
      $scope.activeSlide = scope.totalSlides;
    }
  });

  $scope.next = function() {
    $scope.activeSlide++;
  };

  $scope.previous = function() {
    $scope.activeSlide--;
  };

  $scope.isInsideDeck = function() {
    return !this.isBefore() && !this.isAfter();
  };

  $scope.isBefore = function() {
    return $scope.activeSlide < 0;
  };

  $scope.isAfter = function() {
    return $scope.activeSlide >= $scope.totalSlides;
  };
};


module.service('title', TitleService);
function TitleService() {
  var title = $('title');
  var prefix = title.text();

  this.reset = function() {
    this.set('');
  };

  this.set = function(value) {
    title.text(prefix);
    if (value) {
      title.text(prefix + ': ' + value);
    }
  };
};


module.directive('deck', function(title) {
  function link($scope, element, attrs) {
    var slides = element.find('slide');

    function restack() {
      slides.each(function(i, slide) {
        slide.style.zIndex = 'auto';
        if ($(slide).hasClass('next')) {
          slide.style.zIndex = -i;
        }
      });
    }

    restack();

    $scope.total(slides.length);
    $scope.current(-1);

    $scope.$watch('current()', function(value) {
      title.reset();
      slides.each(function(i, slide) {
        $(slide).removeClass('previous current next');
        if (i < value) {
          $(slide).addClass('previous');
        } else if (i == value) {
          $(slide).addClass('current');
          title.set($(slide).find('h2').text());
        } else {
          $(slide).addClass('next');
        }
      });

      if (value < -1 || isNaN(value)) {
        $scope.current(-1);
      } else if (value > slides.length) {
        $scope.current(slides.length);
      } else {
        restack();
      }
    });
  };

  return {
    restrict: 'E', // Allow it on elements
    scope: {
      current: 'accessor',
      total: 'accessor'
    },
    link: link
  };
});


module.directive('slideCode', function() {
  return function(scope, element, attrs) {
    var value = attrs.slideCode;

    element.addClass('brush: js; toolbar: false;');
    if (value != 'js') {
      element.addClass('html-script: true;');
    }
    element.attr('ng-non-bindable', '');
  };
});


module.directive('slideFlip', function() {
  return function(scope, element, attrs) {
    var back = element.find('.back');
    var front = element.find('.front');

    element.find('.flip').click(function() {
      back.toggleClass('expanded');
      front.toggleClass('expanded');
    });
  };
});

})(angular.module('PresentationModule', []));