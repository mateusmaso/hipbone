(function() {
  var _;

  _ = require("underscore");

  module.exports = {
    initializeValidations: function() {
      this.errors = [];
      return this.validations || (this.validations = {});
    },
    hasErrors: function(attributes) {
      if (attributes == null) {
        attributes = [];
      }
      if (_.isEmpty(attributes)) {
        return this.errors.length > 0;
      } else {
        return _.intersection(this.errors, attributes).length > 0;
      }
    },
    validate: function(attributes) {
      var attribute, validation, value;
      if (attributes == null) {
        attributes = {};
      }
      this.errors = [];
      for (attribute in attributes) {
        value = attributes[attribute];
        validation = this.validations[attribute];
        if (validation && !validation.apply(this, [value, attributes])) {
          this.errors.push(attribute);
        }
      }
      if (this.hasErrors()) {
        return this.errors;
      }
    }
  };

}).call(this);
