Module = require "./module"

module.exports = class Route extends Module

  @registerModule "Route"

  @include Backbone.Events
  @include require "./route/url"
  @include require "./route/view"
  @include require "./route/title"
  @include require "./route/store"
  @include require "./route/active"
  @include require "./route/populate"
  @include require "./route/parameters"

  constructor: (params={}, options={}) ->
    return route if route = @initializeStore(options.hashName, params)
    @cid = _.uniqueId('route')
    @initializeView(options.templateName, options.contentTemplateName)
    @initializeParameters(params, options.paramsDefaults)
    @initialize(params)
    @on("all", => @store())
    @prepare()
    @store()

  initialize: (params={}) ->
