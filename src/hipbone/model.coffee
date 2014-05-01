class Hipbone.Model extends Backbone.Model
  
  @include Hipbone.Instance
  @include Hipbone.Validation
  @include Hipbone.Property
  @include Hipbone.Mapping
  @include Hipbone.Ajax 
  
  constructor: (attributes={}, options={}) ->
    return instance if @ isnt instance = @makeInstance(attributes, options)
    @defaults ||= {}
    @defaults.type ||= "Model"
    @initializeValidation()
    @initializeProperty()
    @initializeMapping()
    super(attributes, options)

  toHash: (attributes={}) ->
    attributes.id

  updateHash: ->
    @setHash(hash) if hash = @toHash(@attributes)

  updateTrack: ->
    @setTrack(track) if track = @toTrack(@attributes)

  prepareInstance: (attributes={}, options={}) ->
    @set(attributes, options)

  hasAttributes: (attributes...) ->
    _.every(attributes, (attribute) => @attributes[attribute]?)

  get: (attribute) ->
    if not (value = super)?
      value = @getMapping(attribute) if @mappings[attribute]
      value = @getProperty(attribute) if @properties[attribute]
    value

  set: (attribute, value, options) ->
    if _.isObject(attribute)
      attributes = attribute
      options = value
    else
      attributes = {}
      attributes[attribute] = value

    for attribute, value of _.pick(attributes, _.keys(@mappings))
      @setMapping(attribute, value, parse: true, parent: @)
      delete attributes[attribute]

    value = super(attributes, options)
    
    @updateHash()
    @updateTrack()

    value

  prepare: ->
    $.when(@synced || @fetch())

  save: (attributes, options={}) ->
    options.success = _.catenate((=> @trigger('save')), options.success)
    super(attributes, options)

  toJSON: (options={}) ->
    json = _.deepClone(super)
    if options.properties isnt false
      json = _.extend(json, hash: @hash, cid: @cid)
      json[property] = @get(property) for property, callback of @properties
    for mapping, mappings of options.mappings || {} when @get(mapping)
      json[mapping] = @get(mapping).toJSON(_.extend({}, options, mappings: mappings))
    json

  parse: (response={}) ->
    @synced = Date.now()
    response

  sync: (method, model, options={}) ->
    options.properties = false
    options.url ||= model.url() 
    options = @ajaxSettings(options)
    @ajaxHandle(Backbone.sync(method, model, options))

  unsync: ->
    delete @synced
    @trigger('unsync', @)
