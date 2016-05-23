(function() {
  module.exports = {
    active: function() {},
    beforeActivate: function() {
      return true;
    },
    activate: function() {
      if (this.beforeActivate() !== false) {
        return this.prepare().done((function(_this) {
          return function() {
            _this.active();
            _this.trigger("active");
            _this.renderTitle();
            return _this.renderElement();
          };
        })(this));
      }
    }
  };

}).call(this);
