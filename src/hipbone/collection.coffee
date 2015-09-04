class Hipbone.Collection extends Backbone.Collection

  @include Hipbone.Accessor

  model: Hipbone.Model

  hashName: "collection"

  constructor: (models, options={}) ->
    unless _.isArray(models)
      options = models || {}
      models = undefined

    hashes = @hashes(models, options)

    if collection = Hipbone.app.identityMap.findAll(hashes)[0]
      collection.set(models, options) if models
      collection.setMeta(options.meta) if options.meta
      collection.parent = options.parent if options.parent
      return collection
    else
      @store(hashes)

    @cid = _.uniqueId('col')
    @parent = options.parent
    @initializeAccessor(accessorName: "meta", accessorsName: "meta", accessorEvent: "change:meta", accessors: options.meta, defaults: offset: 0, limit: 10)
    super

  _prepareModel: (attributes, options={}) ->
    unless @_isModel(attributes)
      attributes = new (Hipbone.app.models[@parseModelType(attributes)] || @model)(attributes, options)
    super

  modelId: (attributes) ->
    if @model and @_isModel(@model::)
      Model = @model
    else
      Model = Hipbone.app.models[@parseModelType(attributes)]

    if attributes[Model::idAttribute]
      "#{attributes[Model::typeAttribute]}-#{attributes[Model::idAttribute]}"
    else
      super

  url: ->
    if @parent then @parent.url() + @urlRoot else @urlRoot

  set: (models, options={}) ->
    super(models, options)
    @store()

  setAccessor: ->
    Hipbone.Accessor.setAccessor.apply(this, arguments)
    @store()

  fetch: (options={}) ->
    options.data ||= {}
    options.data[key] = value for key, value of @meta when value?

    if options.increment
      @setMeta(offset: @getMeta('offset') + @getMeta('limit'))
      options.data.offset = @getMeta("offset")
    else
      options.data.offset = 0
      options.data.limit = @getMeta("offset") + @getMeta("limit")

    super(options)

  fetchMore: (options={}) ->
    @fetch(_.extend(remove: false, increment: true, options))

  hasMore: ->
    @length is (@getMeta('offset') + @getMeta('limit'))

  toJSON: (options={}) ->
    json = super
    json = _.extend(_.deepClone(@meta), length: @length, cid: @cid, models: json) unless options.sync
    json

  hashes: (models, options={}) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push("#{@hashName}-#{options.parent.cid}") if options.parent?.cid
    hashes

  parse: (response={}) ->
    @synced = Date.now()
    @setMeta(response.meta)
    response.models || response

  parseModelType: (attributes={}) ->
    attributes.type

  prepare: ->
    $.when(@synced || @fetch())

  unsync: ->
    delete @synced
    @trigger('unsync', this)

  store: (hashes) ->
    hashes ||= @hashes(@models, parent: @parent, meta: @meta)
    Hipbone.app.identityMap.storeAll(hashes, this)
