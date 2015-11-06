Module = require "./module"

module.exports = class Route extends Module

  @include Backbone.Events
  @include require "./route/store"
  @include require "./route/title"
  @include require "./route/element"
  @include require "./route/populate"
  @include require "./route/activate"
  @include require "./route/parameters"

  constructor: (params={}, options={}) ->
    return route if route = @initializeStore(params, options)
    @cid = _.uniqueId('route')
    @initializeTitle(options.titleRoot)
    @initializeElement(options.elementRoot)
    @initializePopulate()
    @initializeParameters(params)
    @initialize(params)
    @storeChanges()

  initialize: (params={}) ->

  @register "Route"
