Module = require "./module"

module.exports = class History extends Backbone.History

  _.extend(this, Module)

  route: (route, callback) ->
    @handlers.push(route: route, callback: callback)

  reload: (url) ->
    if url
      @location.assign(url)
    else
      @location.reload()

  change: (parameters) ->
    delete parameters[key] for key, value of parameters when not value?
    fragment = @getPathname()
    fragment += "?#{$.param(parameters)}" unless _.isEmpty(parameters)
    @history.replaceState({}, document.title, fragment)

  parameters: ->
    parameters = {}
    regex = /([^&=]+)=?([^&]*)/g
    while match = regex.exec(@getSearch().substring(1))
      [pair, key, value] = match
      parameters[@decode(key)] = _.parse(@decode(value))
    parameters

  decode: (string) ->
    decodeURIComponent(string.replace(/\+/g, " "))

  checkUrl: (event) ->
    @popstate = true
    super
    @popstate = false

  getPathname: ->
    "/#{@getPath().replace(@getSearch(), "")}"

  @register "History"
