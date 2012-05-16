(function(module) {

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

})(angular.module('DomModule', []));