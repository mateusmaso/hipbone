(function() {
  var Model,
    slice = [].slice;

  Model = require("./../model");

  module.exports = {
    countAttribute: "count",
    initializeMeta: function(meta) {
      if (meta == null) {
        meta = {};
      }
      this.meta = new (Model.define({
        defaults: this.defaults,
        url: this.metaUrl,
        parse: this.metaParse
      }))(meta);
      this.listenTo(this.meta, "all", (function(_this) {
        return function() {
          var args, eventName;
          eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          return _this.trigger.apply(_this, ["meta:" + eventName].concat(slice.call(args)));
        };
      })(this));
      this.on("add", this.incrementCounter);
      return this.on("remove", this.decrementCounter);
    },
    metaUrl: (function(_this) {
      return function() {
        return _this.url();
      };
    })(this),
    metaParse: function(response) {
      return response.meta;
    },
    incrementCounter: function(model, collection, options) {
      if (options == null) {
        options = {};
      }
      if (this.meta.has(this.countAttribute) && !options.parse) {
        return this.meta.set(this.countAttribute, this.meta.get(this.countAttribute) + 1);
      }
    },
    decrementCounter: function(model, collection, options) {
      if (options == null) {
        options = {};
      }
      if (this.meta.has(this.countAttribute) && !options.parse) {
        return this.meta.set(this.countAttribute, this.meta.get(this.countAttribute) - 1);
      }
    }
  };

}).call(this);
