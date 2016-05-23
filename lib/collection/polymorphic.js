(function() {
  var _;

  _ = require("underscore");

  module.exports = {
    preparePolymorphic: function(attributes, options) {
      var Model, i, len, ref;
      if (options == null) {
        options = {};
      }
      if (!this._isModel(attributes) && _.isArray(this.model)) {
        ref = this.model;
        for (i = 0, len = ref.length; i < len; i++) {
          Model = ref[i];
          if (Model.prototype.moduleName === this.polymorphicType(attributes)) {
            return new Model(attributes, options);
          }
        }
      }
    },
    polymorphicId: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes[this.polymorphicIdAttribute(attributes)];
    },
    polymorphicType: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes[this.polymorphicTypeAttribute(attributes)];
    },
    polymorphicIdAttribute: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return "id";
    },
    polymorphicTypeAttribute: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return "type";
    },
    polymorphicUniqueId: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return (this.polymorphicId(attributes)) + "-" + (this.polymorphicType(attributes));
    }
  };

}).call(this);
