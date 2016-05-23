$ = require "jquery"
_ = require "underscore"

module.exports =

  change: (query={}) ->
    delete query[key] for key, value of query when not value?
    fragment = @getPathname()
    fragment += "?#{$.param(query)}" unless _.isEmpty(query)
    @history.replaceState({}, document.title, fragment)

  getQuery: ->
    query = {}
    regex = /([^&=]+)=?([^&]*)/g
    while match = regex.exec(@getSearch().substring(1))
      [pair, key, value] = match
      query[@decode(key)] = _.parse(@decode(value))
    query

  decode: (string) ->
    decodeURIComponent(string.replace(/\+/g, " "))
