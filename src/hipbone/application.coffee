Module = require "./module"
Router = require "./router"
Storage = require "./storage"

module.exports = class Application extends Module

  @include Backbone.Events
  @include require "./application/ajax"
  @include require "./application/state"
  @include require "./application/locale"
  @include require "./application/initializers"

  constructor: (state={}, options={}) ->
    @initializeAjax()
    @initializeState(state)
    @initializeLocale(options.locale)
    @initializeInitializers()
    @router = new Router(title: @title)
    @storage = new Storage(@prefix)
    @runInitializers(options)
    @initialize(options)

  initialize: (options={}) ->

  run: ->
    @trigger("run")
    @router.start()

  @register "Application"
