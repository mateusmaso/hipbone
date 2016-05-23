(function() {
  var $;

  $ = require("jquery");

  module.exports = function() {
    return $('body').on("submit", "form:not([bypass])", function(event) {
      return event.preventDefault();
    });
  };

}).call(this);
