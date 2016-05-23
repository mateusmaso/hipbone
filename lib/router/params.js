(function() {
  var _;

  _ = require("underscore");

  module.exports = {
    initializeParams: function() {
      return this.params || (this.params = {});
    },
    updateParams: function(params) {
      if (params == null) {
        params = {};
      }
      return this.params = _.extend(this.history.getQuery(), params);
    }
  };

}).call(this);
