(function() {
  var $, _;

  $ = require("jquery");

  _ = require("underscore");

  module.exports = {
    change: function(query) {
      var fragment, key, value;
      if (query == null) {
        query = {};
      }
      for (key in query) {
        value = query[key];
        if (value == null) {
          delete query[key];
        }
      }
      fragment = this.getPathname();
      if (!_.isEmpty(query)) {
        fragment += "?" + ($.param(query));
      }
      return this.history.replaceState({}, document.title, fragment);
    },
    getQuery: function() {
      var key, match, pair, query, regex, value;
      query = {};
      regex = /([^&=]+)=?([^&]*)/g;
      while (match = regex.exec(this.getSearch().substring(1))) {
        pair = match[0], key = match[1], value = match[2];
        query[this.decode(key)] = _.parse(this.decode(value));
      }
      return query;
    },
    decode: function(string) {
      return decodeURIComponent(string.replace(/\+/g, " "));
    }
  };

}).call(this);
