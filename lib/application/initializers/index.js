(function() {
  module.exports = {
    initializeInitializers: function() {
      this.initializers || (this.initializers = []);
      this.initializers.unshift(require("./parse_body"));
      this.initializers.unshift(require("./parse_model"));
      this.initializers.unshift(require("./link_bridge"));
      this.initializers.unshift(require("./prevent_form"));
      this.initializers.unshift(require("./prepare_sync"));
      return this.initializers.unshift(require("./register_helpers"));
    },
    runInitializers: function(options) {
      var i, initializer, len, ref, results;
      ref = this.initializers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        initializer = ref[i];
        results.push(initializer.apply(this, [options]));
      }
      return results;
    }
  };

}).call(this);
