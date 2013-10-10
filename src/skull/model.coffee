class Skull.Model extends Backbone.Model
  
  @include Skull.Instance
  @include Skull.Validation
  @include Skull.Property
  @include Skull.Mapping
  @include Skull.Station
  @include Skull.Ajax 
  
  constructor: (attributes={}, options) ->
    return instance if @ isnt instance = @makeInstance(attributes, options)
    @defaults ||= {}
    @defaults.type ||= @constructor.name
    @initializeStation()
    @initializeValidation()
    @initializeProperty()
    @initializeMapping()
    super(attributes, options)
    @on("change", @updateHash)
    @on("change", @updateTrack)

  toHash: (attributes) ->
    attributes.id

  updateHash: ->
    @setHash(hash) if hash = @toHash(@attributes)

  updateTrack: ->
    @setTrack(track) if track = @toTrack(@attributes)

  prepareInstance: (attributes, options) ->
    @set(attributes, options) if attributes

  hasAttributes: (attributes...) ->
    _.every(attributes, (attribute) => @attributes[attribute]?)

  get: (attribute) ->
    if not (value = super)?
      value = @prepareMapping(attribute) if @mappings[attribute]
      value = @prepareProperty(attribute) if @properties[attribute]
    value

  set: (attribute, value, options) ->
    if _.isObject(attribute)
      attributes = attribute
      options = value
    else
      attributes = {}
      attributes[attribute] = value

    for attribute, value of _.pick(attributes, _.keys(@mappings))
      @prepareMapping(attribute, value, parse: true)
      delete attributes[attribute]

    super(attributes, options)

  when: ->
    $.when(@synced || @fetch())

  fetch: (options={}) ->
    options.data ||= {}
    options.data = _.extend(@pick(@fetchAttributes), options.data) if @isNew()
    super(options)

  toJSON: (options={}) ->
    options = _.defaults(options, properties: true, mappings: {})
    json = _.deepClone(super)
    json[mapping] = @get(mapping)?.toJSON(mappings: mappings) for mapping, mappings of options.mappings
    json[property] = @get(property) for property, callback of @properties if options.properties
    json.hash = @hash
    json.cid = @cid
    json

  parse: (response) ->
    @synced = Date.now()
    response

  sync: (method, model, options={}) ->
    options.properties = false
    options.url ||= model.url() 
    options = @ajaxSettings(options)
    @ajaxHandle(Backbone.sync(method, model, options))
