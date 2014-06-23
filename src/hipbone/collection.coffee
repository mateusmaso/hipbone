class Hipbone.Collection extends Backbone.Collection

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
      collection.setParent(options.parent) if options.parent
      return collection
    else
      Hipbone.app.identityMap.storeAll(hashes, this)

    @meta = {}
    @defaults ||= {}
    @cid = _.uniqueId('col')
    @setParent(options.parent)
    @setMeta(_.defaults({}, options.meta, @defaults, offset: 0, limit: 10))
    super

  _prepareModel: (attributes, options={}) ->
    unless @_isModel(attributes)
      attributes = new (Hipbone.app.models[@parseModelType(attributes)] || @model)(attributes, options)
    super

  generateId: (attributes) ->
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
    Hipbone.app.identityMap.storeAll(@hashes(models, parent: @parent, meta: @meta), this)

  getMeta: (key) ->
    @meta[key]

  setMeta: (meta={}, options={}) ->
    @_previousMeta = _.pick(@meta, _.keys(meta))
    if not _.isEqual(@_previousMeta, meta)
      @meta = _.extend(@meta, meta)
      @trigger("change:meta:#{key}", this, value, options) for key, value of meta when value isnt @_previousMeta[key]
      @trigger("change:meta", this, meta, options)

    Hipbone.app.identityMap.storeAll(@hashes(@models, parent: @parent, meta: @meta), this)

  setParent: (parent, options={}) ->
    @_previousParent = @parent
    if @parent isnt parent
      @parent = parent
      @trigger("change:parent", this, @parent, options)

    Hipbone.app.identityMap.storeAll(@hashes(@models, parent: @parent, meta: @meta), this)

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
    if options.sync
      super
    else
      _.extend(_.deepClone(@meta), length: @length, cid: @cid, models: super)

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

  sync: (method, collection, options={}) ->
    options.sync = true
    options.url ||= collection.url()
    options = Hipbone.app.ajaxSettings(options)
    Hipbone.app.ajaxHandle(Backbone.sync(method, collection, options))

  unsync: ->
    delete @synced
    @trigger('unsync', this)
