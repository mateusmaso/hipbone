Module = require "./module"
History = require "./history"

module.exports = class Router extends Backbone.Router

  _.extend(this, Module)

  @include require "./router/url"
  @include require "./router/matches"

  history: Backbone.history = new History

  constructor: (options={}) ->
    @title ||= options.title || "App"
    @initializeMatches()
    super

  navigate: (fragment, options={}) ->
    fragment = @urlFragment(fragment, options.params)

    if options.reload
      @history.reload(fragment)
    else if options.load
      @history.loadUrl(fragment)
    else
      super(fragment, options)

  start: ->
    return if Backbone.History.started
    @history.start(pushState: true)
    @trigger("start")

  @register "Router"
