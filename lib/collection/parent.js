(function() {
  module.exports = {
    initializeParent: function(parent) {
      return this.parent = parent;
    },
    setParent: function(parent, options) {
      if (options == null) {
        options = {};
      }
      if (this.parent !== parent) {
        this.parent = parent;
        if (!options.silent) {
          return this.trigger("change:parent", this.parent);
        }
      }
    },
    parentUrl: function(options) {
      if (options == null) {
        options = {};
      }
      if (this.parent) {
        return "" + (this.parent.url(options)) + this.urlRoot;
      } else {
        return this.urlRoot;
      }
    }
  };

}).call(this);
