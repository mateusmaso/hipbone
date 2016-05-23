(function() {
  var _;

  _ = require("underscore");

  module.exports = {
    getNestedAttribute: function(attribute) {
      return _.path(this.attributes, attribute);
    },
    setNestedAttribute: function(attribute, value, options) {
      var i, len, nestedAttributes, path, paths, previousAttribute, ref, results;
      if (options == null) {
        options = {};
      }
      paths = attribute.split(".");
      if (!_.isEqual(this.get(attribute), value)) {
        nestedAttributes = {};
        nestedAttributes[attribute] = value;
        previousAttribute = this.get(attribute);
        this.attributes = _.pathExtend(this.attributes, nestedAttributes);
        if (!options.silent) {
          ref = _.clone(paths).reverse();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            path = ref[i];
            attribute = paths.join(".");
            paths.pop();
            this.nestedChanged[attribute] = value;
            results.push(this.trigger("change:" + attribute, this, previousAttribute, options));
          }
          return results;
        }
      }
    },
    setNestedAttributes: function(attributes, options) {
      var attribute, results, value;
      if (attributes == null) {
        attributes = {};
      }
      if (options == null) {
        options = {};
      }
      this.nestedChanged = {};
      results = [];
      for (attribute in attributes) {
        value = attributes[attribute];
        if (!(attribute.split(".").length > 1)) {
          continue;
        }
        this.setNestedAttribute(attribute, value, options);
        results.push(delete attributes[attribute]);
      }
      return results;
    },
    triggerNestedChange: function(options) {
      if (_.keys(this.changed).length === 0 && _.keys(this.nestedChanged).length !== 0) {
        return this.trigger('change', this, options);
      }
    }
  };

}).call(this);
