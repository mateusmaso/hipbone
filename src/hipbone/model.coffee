class Hipbone.Model extends Backbone.Model

  @include Hipbone.Mapping
  @include Hipbone.Validation
  @include Hipbone.ComputedAttribute

  hashName: "model"

  typeAttribute: "type"

  constructor: (attributes={}, options={}) ->
    hashes = @hashes(attributes)

    if model = Hipbone.app.identityMap.findAll(hashes)[0]
      model.set(attributes, options)
      return model
    else
      Hipbone.app.identityMap.storeAll(hashes, this)

    @initializeMapping()
    @initializeValidation()
    @initializeComputedAttribute()
    super

  get: (attribute) ->
    if @mappings[attribute] or _.contains(@polymorphics, attribute)
      @getMapping(attribute)
    else if @computedAttributes[attribute]
      @getComputedAttribute(attribute)
    else
      super

  set: (attribute, value, options) ->
    if _.isObject(attribute)
      attributes = attribute
      options = value
    else
      attributes = {}
      attributes[attribute] = value

    @type = attributes[@typeAttribute] || @type

    for attribute, value of _.pick(attributes, _.keys(@mappings), @polymorphics)
      @setMapping(attribute, value, parse: true)
      delete attributes[attribute]

    super(attributes, options)

    Hipbone.app.identityMap.storeAll(@hashes(@attributes), this)

  toJSON: (options={}) ->
    mappings = options.mappings || {}
    computedAttributes = options.computedAttributes || _.keys(@computedAttributes)
    _.extend(_.deepClone(super), @toJSONMappings(mappings), @toJSONComputedAttributes(computedAttributes), cid: @cid)

  hashes: (attributes) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push("#{@hashName}-#{attributes[@idAttribute]}") if attributes[@idAttribute]
    hashes

  parse: (response={}) ->
    @synced = Date.now()
    response

  prepare: ->
    $.when(@synced || @fetch())

  sync: (method, model, options={}) ->
    options.url ||= model.url()
    options.computedAttributes = []
    options = Hipbone.app.ajaxSettings(options)
    Hipbone.app.ajaxHandle(Backbone.sync(method, model, options))

  unsync: ->
    delete @synced
    @trigger('unsync', this)
