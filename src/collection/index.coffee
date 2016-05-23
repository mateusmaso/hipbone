$ = require "jquery"
_ = require "underscore"
Backbone = require "backbone"
Model = require "./../model"
Module = require "./../module"

module.exports = class Collection extends Backbone.Collection

  _.extend(this, Module)

  @include require "./sync"
  @include require "./meta"
  @include require "./store"
  @include require "./parent"
  @include require "./filters"
  @include require "./populate"
  @include require "./pagination"
  @include require "./polymorphic"

  model: Model

  constructor: (models, options={}) ->
    unless _.isArray(models)
      options = models || {}
      models = undefined

    return collection if collection = @initializeStore(models, options)
    @cid = _.uniqueId('collection')
    @initializeMeta(options.meta)
    @initializeParent(options.parent)
    @initializeFilters()
    @initializePopulate()
    @initializePagination()
    super
    @storeChanges()

  _prepareModel: (attributes, options={}) ->
    attributes = model if model = @preparePolymorphic(attributes, options)
    super(attributes, options)

  modelId: (attributes) ->
    if _.isArray(@model) then @polymorphicUniqueId(attributes) else super

  url: (options) ->
    url = @parentUrl(options)
    url = "#{url}?#{$.param(@getFilters(options))}" unless _.isEmpty(@getFilters(options))
    url

  toJSON: (options={}) ->
    json = super
    json = _.extend(cid: @cid, length: @length, meta: @meta.toJSON(), models: json) unless options.sync
    json

  parse: (response={}) ->
    @didSync()
    @meta.set(response.meta) if response.meta
    response.models || response

  @register "Collection"
