_ = require "underscore"
Backbone = require "backbone"
Module = require "./../module"

module.exports = class Route extends Module

  @include Backbone.Events
  @include require "./store"
  @include require "./title"
  @include require "./element"
  @include require "./populate"
  @include require "./activate"
  @include require "./parameters"

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
