class Skull.Router extends Backbone.Router

  match: (route, options) ->
    @route route, options.as, =>
      @params = @parse(location.search.substring(1))  
      @params[name.substring(1)] = Skull.parse(arguments[i]) for name, i in route.match(/:\w+/g) || []
      @params.action = options.action   
      @params.controller = options.controller
      @chained = (chain = options.as + @params[options.chain]) is @chain and options.chain
      @controller = new Skull.app.controllers["#{_.string.capitalize(@params.controller)}Controller"]
      @controller.action(@params, @chained)
      @chain = chain

  start: (options) ->
    Backbone.history.start(options)
  
  stop: ->
    Backbone.history.stop() if Backbone.history.started

  reload: ->
    window.location.reload()

  navigate: (fragment, options={}) ->
    anchor = $("<a/>").attr("href", fragment).get(0)
    anchor.search = $.param(options.params) if options.params
    fragment = anchor.pathname + anchor.search
    if options.reload then window.location = fragment else super(fragment, options)
  
  location: ->
    window.location.pathname + window.location.search

  parse: (query) ->
    params = {}
    regex = /([^&=]+)=?([^&]*)/g
    while match = regex.exec(query)
      [pair, key, value] = match
      params[Skull.decode(key)] = Skull.parse(Skull.decode(value))
    params

  setTitle: (title) ->
    document.title = title

  setSubtitle: (title) ->
    @setTitle("#{title} - #{Skull.app.title}")
