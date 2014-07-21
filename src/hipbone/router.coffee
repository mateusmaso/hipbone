class Hipbone.Router extends Backbone.Router

  constructor: (options={}) ->
    @matches = {}
    super

  buildUrl: (name, params) ->
    Hipbone.app.routes[@matches[name]]::buildUrl(params)

  matchUrl: (name) ->
    Hipbone.app.routes[@matches[name]]::matchUrl

  match: (name) ->
    @matches[name] = "#{_.string.capitalize(name)}Route"
    url = @matchUrl(name)

    @route url, name, ->
      @params = Hipbone.history.parameters()
      for param, index in url.match(/:\w+/g) || [] when arguments[index]
        @params[param.substring(1)] = _.parse(arguments[index])
      @route = new Hipbone.app.routes[@matches[name]](@params)

  navigate: (fragment, options={}) ->
    fragment = @buildUrl(fragment, options) if @matches[fragment]
    anchor = $("<a>").attr("href", fragment).get(0)
    anchor.search = $.param(options.params) if options.params
    fragment = anchor.pathname + anchor.search

    if options.reload
      Hipbone.history.reload(fragment)
    else if options.load
      Hipbone.history.loadUrl(fragment)
    else
      super(fragment, options)
