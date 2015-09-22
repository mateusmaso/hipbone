Model = require "./model"
Module = require "./module"

module.exports = class Collection extends Backbone.Collection

  _.extend(this, Module)

  @include require "./collection/sync"
  @include require "./collection/meta"
  @include require "./collection/store"
  @include require "./collection/parent"
  @include require "./collection/filters"
  @include require "./collection/populate"
  @include require "./collection/pagination"
  @include require "./collection/polymorphic"

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
    @store()
    @on("all", _.debounce => @store())
    @on("add remove reset sort", => @trigger("update", this))

  _prepareModel: (attributes, options={}) ->
    attributes = model if model = @preparePolymorphic(attributes, options)
    super(attributes, options)

  modelId: (attributes) ->
    if _.isArray(@model) then @polymorphicUniqueId(attributes) else super

  url: (options) ->
    query = @getFilters(options)
    url = @parentUrl(options)
    url = "#{url}?#{$.param(query)}" unless _.isEmpty(query)
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
