class Skull.Collection extends Backbone.Collection
  
  @include Skull.Instance
  @include Skull.Station
  @include Skull.Ajax

  constructor: (models, options={}) ->
    return instance if @ isnt instance = @makeInstance(models, options)
    @meta = {}
    @defaults ||= {}
    @defaults.type ||= @constructor.name
    @parent = options.parent
    @setMeta(_.extend(offset: 0, limit: 10, @defaults, options.meta))
    @initializeStation()
    super
    @on("add remove reset sort", => @trigger("update"))

  model: (attributes, options) =>
    type = if @mapping is "Polymorphic" then attributes.type else @mapping
    new (Skull.app.models[type] || Skull.Model)(attributes, options)

  url: ->
    if @parent then @parent.url() + @urlRoot else @urlRoot

  toHash: (models, options={}) ->
    options.parent.cid if options.parent
  
  prepareInstance: (models, options={}) ->
    @set(models, options) if models
    @setMeta(options.meta) if options.meta

  getMeta: (key) ->
    @meta[key]

  setMeta: (meta={}) ->
    _meta = _.pick(@meta, _.keys(meta))
    if not _.isEqual(_meta, meta)
      _.extend(@meta, meta)
      @trigger("change:meta", _meta)

  when: ->
    $.when(@synced || @fetch())
  
  fetch: (options={}) ->
    options.data ||= {}
    options.data[key] = value for key, value of @meta when value?
    super(options)

  fetchMore: (options={}) ->
    @setMeta(offset: @getMeta('offset') + @getMeta('limit'))
    @fetch(_.extend(remove: false, options))

  hasMore: ->
    @length is @getMeta('limit')

  toJSON: ->
    json = _.extend(super, @meta)
    json.hash = @hash
    json.cid = @cid
    json

  parse: (response) ->
    @synced = Date.now()
    @setMeta(response.meta)
    response.collection || response

  sync: (method, collection, options={}) ->
    options.url ||= collection.url()
    options = @ajaxSettings(options)
    @ajaxHandle(Backbone.sync(method, collection, options))
