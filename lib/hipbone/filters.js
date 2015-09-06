(function() {
  Hipbone.Filter = {
    initializeFilter: function(filters) {
      if (filters == null) {
        filters = {};
      }
      return this.filters = _.extend({}, this.filters, filters);
    },
    filterJSON: function(options) {
      var attribute, json, value;
      json = {};
      for (attribute in filters) {
        value = filters[attribute];
        if (_.isFunction(value)) {
          json[attribute] = value.apply(this, [options]);
        } else {
          json[attribute] = value;
        }
      }
      return json;
    }
  };

}).call(this);
