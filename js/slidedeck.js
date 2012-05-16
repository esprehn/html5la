(function(module) {

module.directive('slideDeck', function(title) {
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
    var front = element.find('slide-front');
    var back = element.find('slide-back');

    front.addClass('expanded');

    element.find('.flip').click(function() {
      back.toggleClass('expanded');
      front.toggleClass('expanded');
    });
  };
});

})(angular.module('SlideDeckModule', ['DomModule']));