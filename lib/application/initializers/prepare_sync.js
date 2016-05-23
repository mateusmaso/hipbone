(function() {
  var Backbone;

  Backbone = require("backbone");

  module.exports = function() {
    var sync;
    sync = Backbone.sync;
    return Backbone.sync = (function(_this) {
      return function(method, model, options) {
        if (options == null) {
          options = {};
        }
        options.sync = true;
        options.url || (options.url = model.url(options));
        options = _this.ajaxSettings(options);
        return _this.ajaxHandle(sync.apply(Backbone, [method, model, options]));
      };
    })(this);
  };

}).call(this);
