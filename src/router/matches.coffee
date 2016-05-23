_ = require "underscore"

module.exports =

  initializeMatches: ->
    @matches ||= {}

  match: (pattern, options={}) ->
    @matches[options.name] = options
    @route pattern, options.name, ->
      Route = options.route
      @_route = new Route(@params, pathname: @history.getPathname(), popstate: @history.popstate)
      @_route.activate()

  matchUrl: (name, params={}) ->
    if match = @matches[name]
      fragment = @matchFragment(name, params)
      @url(fragment, _.omit(params, @matchUrlParamKeys(name)))

  matchUrlParams: (name, args) ->
    params = {}
    for param, index in @matchUrlParamKeys(name) when args[index]
      params[param] = _.parse(args[index])
    params

  matchUrlParamKeys: (name) ->
    param.substring(1) for param in @matches[name].url.match(/:\w+/g) || []

  matchFragment: (name, params={}) ->
    url = @matches[name].url
    url = url.replace(":#{param}", params[param]) for param in @matchUrlParamKeys(name)
    url
