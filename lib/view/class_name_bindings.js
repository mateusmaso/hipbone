(function() {
  var _;

  _ = require("underscore");

  module.exports = {
    initializeClassNameBindings: function() {
      return this.classNameBindings || (this.classNameBindings = {});
    },
    updateClassNameBindings: function() {
      var callback, className, oldValue, ref, results, value;
      this._classNameBindings || (this._classNameBindings = {});
      ref = this.classNameBindings;
      results = [];
      for (className in ref) {
        callback = ref[className];
        oldValue = this._classNameBindings[className];
        value = this._classNameBindings[className] = callback.apply(this);
        if (_.isBoolean(value)) {
          if (value) {
            results.push(this.$el.addClass(className));
          } else {
            results.push(this.$el.removeClass(className));
          }
        } else if (value !== oldValue) {
          this.$el.removeClass(oldValue);
          results.push(this.$el.addClass(value));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);
