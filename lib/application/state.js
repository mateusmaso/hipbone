(function() {
  var Model;

  Model = require("./../model");

  module.exports = {
    initializeState: function(state) {
      if (state == null) {
        state = {};
      }
      this.state = new (Model.define({
        defaults: this.defaults,
        urlRoot: this.urlRoot,
        parse: this.parse
      }))(state);
      return this.listenTo(this.state, "all", (function(_this) {
        return function() {
          return _this.trigger.apply(_this, arguments);
        };
      })(this));
    },
    fetch: function() {
      return this.state.fetch.apply(this.state, arguments);
    },
    parse: function(response) {
      return response;
    },
    get: function() {
      return this.state.get.apply(this.state, arguments);
    },
    set: function() {
      return this.state.set.apply(this.state, arguments);
    }
  };

}).call(this);
