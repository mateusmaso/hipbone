Module = require "./../module"
Router = require "./../router"
Storage = require "./../storage"
Backbone = require "backbone"

module.exports = class Application extends Module

  @include Backbone.Events
  @include require "./ajax"
  @include require "./state"
  @include require "./locale"
  @include require "./initializers"

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
