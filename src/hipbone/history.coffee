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

  change: (query={}) ->
    delete query[key] for key, value of query when not value?
    fragment = @getPathname()
    fragment += "?#{$.param(query)}" unless _.isEmpty(query)
    @history.replaceState({}, document.title, fragment)

  decode: (string) ->
    decodeURIComponent(string.replace(/\+/g, " "))

  checkUrl: (event) ->
    @popstate = true
    super
    @popstate = false

  getQuery: ->
    query = {}
    regex = /([^&=]+)=?([^&]*)/g
    while match = regex.exec(@getSearch().substring(1))
      [pair, key, value] = match
      query[@decode(key)] = _.parse(@decode(value))
    query

  getPathname: ->
    "/#{@getPath().replace(@getSearch(), "")}"

  @register "History"
