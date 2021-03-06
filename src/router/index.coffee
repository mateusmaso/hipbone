_ = require "underscore"
Backbone = require "backbone"
Module = require "./../module"
History = require "./../history"

module.exports = class Router extends Backbone.Router

  _.extend(this, Module)

  @include require "./url"
  @include require "./params"
  @include require "./matches"

  history: Backbone.history = new History

  constructor: (options={}) ->
    @initializeParams()
    @initializeMatches()
    super

  execute: (callback, args, name) ->
    @updateParams(@matchUrlParams(name, args))
    super

  navigate: (fragment, options={}) ->
    fragment = @matchUrl(fragment, options.params) || @url(fragment, options.params)

    if options.reload
      @history.reload(fragment)
    else if options.load
      @history.loadUrl(fragment)
    else
      super(fragment, options)

  restart: ->
    @history.stop()
    @history.start(pushState: true)
    @trigger("restart")

  start: ->
    return if Backbone.History.started
    @history.start(pushState: true)
    @trigger("start")

  @register "Router"
