(function() {
  var slice = [].slice;

  module.exports = {
    bubble: function() {
      var args, eventName;
      eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this.trigger.apply(this, arguments);
      return this.$el.trigger(eventName, args);
    }
  };

}).call(this);
