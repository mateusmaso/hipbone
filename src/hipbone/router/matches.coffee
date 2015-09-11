module.exports =

  initializeMatches: (matches={}) ->
    @matches = _.extend({}, @matches, matches)

  match: (name) ->
    @matches[name] = "#{_.string.capitalize(name)}Route"
    url = Hipbone.app.routes[@matches[name]]::url

    @route url, name, ->
      params = Hipbone.app.history.parameters()
      for param, index in url.match(/:\w+/g) || [] when arguments[index]
        params[param.substring(1)] = _.parse(arguments[index])
      route = new Hipbone.app.routes[@matches[name]](params)
      route.active()
