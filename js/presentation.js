
function PresentationController($location, keyboard) {
  var scope = this;
  var RIGHT_ARROW = 39;
  var LEFT_ARROW = 37;

  keyboard.on(RIGHT_ARROW, function() {
    scope.activeSlide++;
  });

  keyboard.on(LEFT_ARROW, function() {
    scope.activeSlide--;
  });

  scope.$watch('activeSlide', function(scope, value) {
    if (value == -1) {
      $location.url('');
    } else if (value > -1) {
      $location.url('/slides/' + (value + 1));
    }
  });

  scope.$watch(function() { return $location.url(); }, function(scope, value) {
    var match = /\/slides\/(\d+)/.exec(value);
    if (match) {
      scope.activeSlide = parseInt(match[1], 10) - 1;
    } else if (value == '/slides/end') {
      scope.activeSlide = scope.totalSlides;
    }
  });

  scope.isInsideDeck = function() {
    return !this.isBefore() && !this.isAfter();
  };

  scope.isBefore = function() {
    return scope.activeSlide < 0;
  };

  scope.isAfter = function() {
    return scope.activeSlide >= scope.totalSlides;
  };
}

angular.service('keyboard', function() {
  var scope = this;
  return {
    on: function(keyCode, callback) {
      $(window).keydown(function(e) {
        if (e.keyCode == keyCode) {
          scope.$apply(callback);
        }
      });
    }
  };
});

angular.widget('deck', function(element) {
  this.directives(true);
  this.descend(true);
  return function() {
    var slides = element.find('slide');
    var name = element.attr('current');
    var total = element.attr('total');

    function restack() {
      slides.each(function(i, slide) {
        slide.style.zIndex = 'auto';
        if ($(slide).hasClass('next')) {
          slide.style.zIndex = -i;
        }
      });
    }

    restack();

    this.$eval(total + ' = ' + slides.length);

    this.$watch(name, function(scope, value) {
      slides.each(function(i, slide) {
        $(slide).removeClass('previous current next');
        if (i < value) {
          $(slide).addClass('previous');
        } else if (i == value) {
          $(slide).addClass('current');
        } else {
          $(slide).addClass('next');
        }
      });

      if (value < -1 || isNaN(value)) {
        scope.$eval(name + ' = -1');
      } else if (value > slides.length) {
        scope.$eval(name + ' = ' + slides.length);
      }

      restack();
    });
  };
});

angular.widget('@slide:code', function(value, element) {
  element.addClass('brush: js; toolbar: false;');
  if (value != 'js') {
    element.addClass('html-script: true;');
  }
  element.attr('ng:non-bindable', '');
});
