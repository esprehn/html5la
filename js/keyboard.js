(function(module) {

module.service('keyboard', KeyboardService);
function KeyboardService($rootScope) {
  var history = {};

  $(window).keydown(function(e) {
    $rootScope.$apply(function() {
      history[e.keyCode]++;
    });
  });

  this.observe = function(code) {
    history[code] = history[code] || 0;

    return function() {
      return history[code];
    };
  };
};


KeyboardService.configureDirectives = function(keyMap) {
  function addDirective(name, code) {
    var attributeName = 'keyboard' + name;
    module.directive(attributeName, function(keyboard) {
      return function(scope, element, attrs) {
        scope.$watch(keyboard.observe(code), function() {
          scope.$eval(attrs[attributeName]);
        });
      };
    });
  }

  for (var key in keyMap) {
    addDirective(key, keyMap[key]);
  }
};


KeyboardService.configureDirectives({
  'Up': 38,
  'Down': 40,
  'Left': 37,
  'Right': 39,
  'PageUp': 34,
  'PageDown': 33
});

})(angular.module('KeyboardModule', []));