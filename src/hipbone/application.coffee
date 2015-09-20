Module = require "./module"

module.exports = class Application extends Module

  @include Backbone.Events
  @include require "./application/ajax"
  @include require "./application/state"
  @include require "./application/locale"
  @include require "./application/initializers"

  constructor: (state={}, options={}) ->
    @initializeAjax()
    @initializeState(_.extend(assets: {}, state))
    @initializeLocale(options.locale)
    @initializeInitializers()
    @router = new Hipbone.Router(title: @title)
    @storage = new Hipbone.Storage(prefix: @prefix)
    @runInitializers(options)
    @initialize(options)

  initialize: (options={}) ->

  run: ->
    @router.start()
    @trigger("run")

  @register "Application"
