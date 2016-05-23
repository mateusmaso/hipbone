(function() {
  var Handlebars, _, camelize;

  _ = require("underscore");

  Handlebars = require("handlebars");

  camelize = require("camelize");

  module.exports = {
    insert: function() {},
    detach: function() {},
    change: function(attribute, value) {},
    lifecycle: function() {
      return this.$el.lifecycle({
        insert: (function(_this) {
          return function() {
            _this.insert();
            return _this.trigger("insert");
          };
        })(this),
        remove: (function(_this) {
          return function() {
            _this.detach();
            return _this.trigger("detach");
          };
        })(this),
        change: (function(_this) {
          return function(attribute, value) {
            var property;
            _this.change(attribute, value);
            property = camelize(attribute);
            if (!_.contains(_this.internals, property)) {
              return _this.set(property, Handlebars.parseValue(value, _.contains(_this.booleans, property)));
            }
          };
        })(this)
      });
    }
  };

}).call(this);
