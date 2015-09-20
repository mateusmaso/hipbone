Module = require "./module"

module.exports = class Route extends Module

  @include Backbone.Events
  @include require "./route/store"
  @include require "./route/title"
  @include require "./route/element"
  @include require "./route/populate"
  @include require "./route/parameters"

  constructor: (params={}, options={}) ->
    return route if route = @initializeStore(params, options)
    @cid = _.uniqueId('route')
    @initializeTitle(options.titleRoot)
    @initializeElement(options.elementRoot)
    @initializeParameters(params)
    @initialize(params)
    @on("all", => @store())
    @prepare()
    @store()

  initialize: (params={}) ->

  beforeActivate: ->
    true

  activate: ->
    @renderTitle()
    @renderElement()

  @register "Route"
