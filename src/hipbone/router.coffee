class Hipbone.Router extends Backbone.Router

  match: (route, options={}) ->
    @route route, options.as, =>
      @params = @query()
      @params[name.substring(1)] = _.parse(arguments[index]) for name, index in route.match(/:\w+/g) || []
      @params.action = options.action
      @params.controller = options.controller
      @chained = (chain = options.as + @params[options.chain]) is @chain and options.chain
      @controller = new Hipbone.app.controllers["#{_.string.capitalize(@params.controller)}Controller"]
      @controller.action(@params, @chained)
      @chain = chain

  start: (options={}) ->
    Backbone.history.start(options)

  stop: ->
    Backbone.history.stop() if Backbone.History.started

  reload: (options={}) ->
    @clear() if options.clear
    window.location.reload()

  navigate: (fragment, options={}) ->
    anchor = $("<a>").attr("href", fragment).get(0)
    anchor.search = $.param(options.params) if options.params
    fragment = anchor.pathname + anchor.search

    if options.reload
      window.location = fragment
    else if options.load
      Backbone.history.loadUrl(fragment)
    else
      super(fragment, options)

  change: (query) ->
    @params = _.extend(@params, query)
    delete query[key] for key, value of query when not value?
    fragment = window.location.pathname
    fragment += "?#{$.param(query)}" unless _.isEmpty(query)
    window.history.replaceState({}, document.title, fragment)

  clear: ->
    query = @query()
    query[key] = undefined for key in _.keys(query)
    @change(query)

  location: ->
    window.location.pathname + window.location.search

  query: ->
    @parse(window.location.search.substring(1))

  parse: (query) ->
    params = {}
    regex = /([^&=]+)=?([^&]*)/g
    while match = regex.exec(query)
      [pair, key, value] = match
      params[@decode(key)] = _.parse(@decode(value))
    params

  decode: (string) ->
    decodeURIComponent(string.replace(/\+/g, " "))
