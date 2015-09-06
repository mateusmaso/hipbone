sync = Backbone.sync
Hipbone.sync = Backbone.sync = (method, model, options={}) ->
  options.sync = true
  options.url ||= model.url(options)
  options = Hipbone.app.ajaxSettings(options)
  Hipbone.app.ajaxHandle(sync.apply(this, [method, model, options]))
