(function() {
  Hipbone.Filter = {
    initializeFilter: function(filters) {
      if (filters == null) {
        filters = {};
      }
      return this.filters = _.extend({}, this.filters, filters);
    },
    filterJSON: function(options) {
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
