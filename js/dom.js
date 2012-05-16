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


// This service works around a Chrome bug where the Thumbnailer that creates
// the small thumbnails on the new tab page will take a snapshot whenever the
// url hash changes. This takes about 70ms causing stutter in the slide
// animations so we defer the URL change until the animation is complete and
// then only commit the most recent one.
module.service('url', UrlService);
function UrlService($location, $defer) {
  var timer;

  this.set = function(value, opt_timeout) {
    $defer.cancel(timer);
    timer = $defer(function() {
      $location.url(value);
    }, opt_timeout);
  };
};

})(angular.module('DomModule', []));