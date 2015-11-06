Module = require "./module"

module.exports = class History extends Backbone.History

  _.extend(this, Module)

  @include require "./history/query"

  route: (route, callback) ->
    @handlers.push(route: route, callback: callback)

  reload: (url) ->
    if url then @location.assign(url) else @location.reload()

  getPathname: ->
    "/#{@getPath().replace(@getSearch(), "")}"

  navigate: (fragment, options) ->
    @popstate = false
    super

  checkUrl: (event) ->
    @popstate = true
    super

  @register "History"
