Module = require "./module"

module.exports = class Router extends Backbone.Router

  _.extend(this, Module)

  @include require "./router/url"
  @include require "./router/matches"

  constructor: (options={}) ->
    @initializeMatches(options.matches)
    super

  navigate: (fragment, options={}) ->
    fragment = @urlFragment(fragment, options.params)

    if options.reload
      Hipbone.app.history.reload(fragment)
    else if options.load
      Hipbone.app.history.loadUrl(fragment)
    else
      super(fragment, options)
