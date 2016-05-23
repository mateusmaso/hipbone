Backbone = require "backbone"

module.exports = ->

  sync = Backbone.sync
  Backbone.sync = (method, model, options={}) =>
    options.sync = true
    options.url ||= model.url(options)
    options = @ajaxSettings(options)
    @ajaxHandle(sync.apply(Backbone, [method, model, options]))
