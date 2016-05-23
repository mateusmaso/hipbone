(function() {
  module.exports = {
    initializeSchemes: function() {
      return this.schemes || (this.schemes = {});
    },
    validateSchemes: function(attributes) {
      var name, ref, schema, valid;
      if (attributes == null) {
        attributes = {};
      }
      valid = [];
      ref = this.schemes;
      for (name in ref) {
        schema = ref[name];
        if (schema.apply(this, [attributes])) {
          valid.push(name);
        }
      }
      return valid;
    }
  };

}).call(this);
