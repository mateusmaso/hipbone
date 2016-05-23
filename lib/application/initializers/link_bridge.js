(function() {
  var $;

  $ = require("jquery");

  module.exports = function() {
    return $('body').on("click", "a:not([bypass])", (function(_this) {
      return function(event) {
        var href;
        if (!(event.ctrlKey || event.metaKey) && _this.router.history.location.hostname === event.currentTarget.hostname) {
          if (!$(event.currentTarget).attr("target") && (href = $(event.currentTarget).attr("href"))) {
            event.preventDefault();
            return _this.router.navigate(href, {
              trigger: true
            });
          }
        }
      };
    })(this));
  };

}).call(this);
