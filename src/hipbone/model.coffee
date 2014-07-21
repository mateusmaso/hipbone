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
      @store(hashes)

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
      _.path(@attributes, attribute)

  set: (attribute, value, options={}) ->
    if _.isObject(attribute)
      attributes = attribute
      options = value || {}
    else
      attributes = {}
      attributes[attribute] = value

    @type = attributes[@typeAttribute] || @type

    for attribute, value of _.pick(attributes, _.keys(@mappings), @polymorphics)
      @setMapping(attribute, value, parse: true)
      delete attributes[attribute]

    for attribute, value of attributes
      paths = attribute.split(".")

      if paths.length > 1
        value = attributes[attribute]
        delete attributes[attribute]

        unless _.isEqual(@get(attribute), value)
          nestedAttributes = {}
          nestedAttributes[attribute] = value
          previousAttribute = @get(attribute)
          @attributes = _.pathExtend(@attributes, nestedAttributes)

          unless options.silent
            for path in _.clone(paths).reverse()
              attribute = paths.join(".")
              paths.pop()
              @trigger("change:#{attribute}", this, previousAttribute, options)

    super(attributes, options)
    @store()

  toJSON: (options={}) ->
    mappings = options.mappings || {}
    computedAttributes = options.computedAttributes || _.keys(@computedAttributes)
    mappingOptions.sync = true for mapping, mappingOptions of mappings if options.sync
    _.extend(_.deepClone(super), @toJSONMappings(mappings), @toJSONComputedAttributes(computedAttributes), cid: @cid)

  hashes: (attributes) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push("#{@hashName}-#{attributes[@idAttribute]}") if attributes[@idAttribute]
    hashes

  parse: (response={}) ->
    @synced = _.now()
    response

  prepare: ->
    $.when(@synced || @fetch())

  unsync: ->
    delete @synced
    @trigger('unsync', this)

  store: (hashes) ->
    hashes ||= @hashes(@attributes)
    Hipbone.app.identityMap.storeAll(hashes, this)
