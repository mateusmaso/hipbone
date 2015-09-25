module.exports =

  initializeMatches: ->
    @params ||= {}
    @matches ||= {}

  match: (name, options={}) ->
    @matches[name] = options
    url = options.url
    Route = options.route
    @route url, name, ->
      @params = @history.parameters()
      for param, index in url.match(/:\w+/g) || [] when arguments[index]
        @params[param.substring(1)] = _.parse(arguments[index])
      @_route = new Route(@params, path: @history.getPathname(), popstate: @history.popstate)
      @_route.activate()
