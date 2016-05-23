(function() {
  var _;

  _ = require("underscore");

  module.exports = {
    initializeFilters: function() {
      return this.filters || (this.filters = {});
    },
    getFilters: function(options) {
      var attribute, json, ref, value;
      if (options == null) {
        options = {};
      }
      json = {};
      ref = this.filters;
      for (attribute in ref) {
        value = ref[attribute];
        if (_.isFunction(value)) {
          value = value.apply(this, [options]);
        }
        if (value != null) {
          json[attribute] = value;
        }
      }
      return json;
    }
  };

}).call(this);
