(function() {
  var Model, _, dasherize;

  _ = require("underscore");

  dasherize = require("string-dasherize");

  Model = require("./../model");

  module.exports = {
    initializeProperties: function(properties) {
      if (properties == null) {
        properties = {};
      }
      this.internals || (this.internals = []);
      this.props = this.properties = new (Model.define({
        defaults: this.defaults
      }))(_.omit(properties, this.internals));
      return this.listenTo(this.props, "all", (function(_this) {
        return function() {
          return _this.trigger.apply(_this, arguments);
        };
      })(this));
    },
    get: function() {
      return this.props.get.apply(this.props, arguments);
    },
    set: function() {
      return this.props.set.apply(this.props, arguments);
    },
    mergeAttributes: function(attributes) {
      var attribute, ref, value;
      if (attributes == null) {
        attributes = {};
      }
      ref = this.properties.attributes;
      for (attribute in ref) {
        value = ref[attribute];
        if (!(!_.contains(this.internals, attribute))) {
          continue;
        }
        attribute = dasherize(attribute || "");
        if (attribute === "class") {
          attributes[attribute] = (attributes[attribute] + " " + value).trim();
        } else if (_.contains(this.booleans, attribute)) {
          if (value) {
            attributes[attribute] = '';
          }
        } else if (!_.isObject(value)) {
          attributes[attribute] = value;
        }
      }
      return attributes;
    }
  };

}).call(this);
