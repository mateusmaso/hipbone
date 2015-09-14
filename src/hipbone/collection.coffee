Model = require "./model"
Module = require "./module"

module.exports = class Collection extends Backbone.Collection

  _.extend(this, Module)

  @registerModule "Collection"

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

    return collection if collection = @initializeStore(options.hashName, models, options)
    @cid = _.uniqueId('collection')
    @initializeMeta(options.meta, options.defaults)
    @initializeParent(options.parent)
    @initializeFilters(options.filters)
    @initializePagination(options.pagination)
    super
    @on("add remove reset sort", => @trigger("update", this))
    @on("all", => @store())
    @store()

  _prepareModel: (attributes, options={}) ->
    attributes = model if model = @preparePolymorphic(attributes, options)
    super(attributes, options)

  modelId: (attributes) ->
    undefined

  url: (options) ->
    query = @toJSONFilters(options)
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
