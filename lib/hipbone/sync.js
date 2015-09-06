(function() {
  var sync;

  sync = Backbone.sync;

  Hipbone.sync = Backbone.sync = function(method, model, options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    options.url || (options.url = model.url(options));
    options = Hipbone.app.ajaxSettings(options);
    return Hipbone.app.ajaxHandle(sync.apply(this, [method, model, options]));
  };

}).call(this);
