(function() {
  var $;

  $ = require("jquery");

  module.exports = {
    url: function(fragment, params) {
      var anchor;
      if (params == null) {
        params = {};
      }
      anchor = $("<a>").attr("href", fragment).get(0);
      if (params) {
        if (anchor.search.trim() === "") {
          anchor.search += $.param(params);
        } else {
          anchor.search += "&" + ($.param(params));
        }
      }
      fragment = anchor.pathname + anchor.search;
      return fragment;
    }
  };

}).call(this);
