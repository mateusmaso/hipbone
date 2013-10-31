class Skull.Collection extends Backbone.Collection
  
  @include Skull.Instance
  @include Skull.Property
  @include Skull.Station
  @include Skull.Ajax

  constructor: (models, options={}) ->
    return instance if @ isnt instance = @makeInstance(models, options)
    @on("add remove reset sort", => @trigger("update"))
    @cid = _.uniqueId('col')
    @defaults ||= {}
    @defaults.type ||= @constructor.name
    @parent = options.parent
    @meta = {}
    @setMeta(_.extend(offset: 0, limit: 10, @defaults, options.meta))
    @initializeStation()
    @initializeProperty()
    super

  model: (attributes, options={}) =>
    type = if @mapping is "Polymorphic" then attributes.type else @mapping
    new (Skull.app.models[type] || Skull.Model)(attributes, options)

  url: ->
    if @parent then @parent.url() + @urlRoot else @urlRoot

  toHash: (models, options={}) ->
    options.parent.cid if options.parent
  
  prepareInstance: (models, options={}) ->
    @set(models, options) if models
    @setMeta(options.meta) if options.meta

  set: (models, options={}) ->
    models = @parse(models, options) if options.parse
    models = [models] unless _.isArray(models)
    models[index] = @_prepareModel(model, options) for model, index in models
    super(models, options)

  getMeta: (key) ->
    @meta[key]

  setMeta: (meta={}) ->
    current = _.pick(@meta, _.keys(meta))
    if not _.isEqual(current, meta)
      @meta = _.extend(@meta, meta)
      @trigger("change:meta", current)

  prepare: ->
    $.when(@synced || @fetch())
  
  fetch: (options={}) ->
    options.data ||= {}
    options.data[key] = value for key, value of _.omit(@meta, 'type') when value?
    super(options)

  fetchMore: (options={}) ->
    @setMeta(offset: @getMeta('offset') + @getMeta('limit'))
    @fetch(_.extend(remove: false, options))

  hasMore: ->
    @length is @getMeta('limit')

  toJSON: (options={}) ->
    json = super
    if options.properties isnt false
      json = _.extend(_.deepClone(@meta), length: @length, hash: @hash, cid: @cid, models: json)
      json[property] = @getProperty(property) for property, callback of @properties
    json

  parse: (response={}) ->
    @synced = Date.now()
    @setMeta(response.meta)
    response.models || response

  sync: (method, collection, options={}) ->
    options.properties = false
    options.url ||= collection.url()
    options = @ajaxSettings(options)
    @ajaxHandle(Backbone.sync(method, collection, options))

  unsync: ->
    delete @synced
    @trigger('unsync', @)
