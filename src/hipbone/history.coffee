class Hipbone.History extends Backbone.History

  route: (route, callback) ->
    @handlers.push(route: route, callback: callback)

  reload: (url) ->
    if url
      @location.assign(url)
    else
      @location.reload()

  change: (parameters) ->
    delete parameters[key] for key, value of parameters when not value?
    fragment = @location.pathname
    fragment += "?#{$.param(parameters)}" unless _.isEmpty(parameters)
    @history.replaceState({}, document.title, fragment)

  parameters: ->
    parameters = {}
    regex = /([^&=]+)=?([^&]*)/g
    while match = regex.exec(@location.search.substring(1))
      [pair, key, value] = match
      parameters[@decode(key)] = _.parse(@decode(value))
    parameters

  decode: (string) ->
    decodeURIComponent(string.replace(/\+/g, " "))

  checkUrl: (event) ->
    @popstate = true
    super
    @popstate = false

Hipbone.history = Backbone.history = new Hipbone.History