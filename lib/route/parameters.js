(function() {
  var Model, _;

  _ = require("underscore");

  Model = require("./../model/index");

  module.exports = {
    initializeParameters: function(params) {
      if (params == null) {
        params = {};
      }
      this.parse = _.bind(this.parse, this);
      this.params = this.parameters = new (Model.define({
        defaults: this.defaults,
        parse: this.parse
      }))(params, {
        parse: true
      });
      return this.listenTo(this.params, "all", (function(_this) {
        return function() {
          return _this.trigger.apply(_this, arguments);
        };
      })(this));
    },
    get: function() {
      return this.params.get.apply(this.params, arguments);
    },
    set: function() {
      return this.params.set.apply(this.params, arguments);
    },
    parse: function(response) {
      if (response == null) {
        response = {};
      }
      return response;
    }
  };

}).call(this);
