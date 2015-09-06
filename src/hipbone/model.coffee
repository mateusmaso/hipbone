class Hipbone.Model extends Backbone.Model

  @include Hipbone.Filter
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

    @initializeFilter(options.filters)
    @initializeMapping(options.mappings, options.polymorphics)
    @initializeValidation(options.validations)
    @initializeComputedAttribute(options.computedAttributes)
    super

  url: (options) ->
    queryParams = @filterJSON(options)
    url = super
    url = "#{url}?#{$.param(queryParams)}" unless _.isEmpty(queryParams)
    url

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

    changed = false
    onChange = => changed = false

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
              changed = true
              @trigger("change:#{attribute}", this, previousAttribute, options)

    @on("change", onChange)
    super(attributes, options)
    @off("change", onChange)
    @trigger('change', this, options) if changed
    @store()

  toJSON: (options={}) ->
    mappings = options.mappings || {}
    mappingOptions.sync = options.sync for mapping, mappingOptions of mappings
    computedAttributes = options.computedAttributes || _.keys(@computedAttributes)
    json = _.deepClone(super)
    json = _.extend(json, cid: @cid, @toJSONComputedAttributes(computedAttributes), @toJSONMappings(mappings)) unless options.sync
    json

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

  unsync: ->
    delete @synced
    @trigger('unsync', this)

  store: (hashes) ->
    hashes ||= @hashes(@attributes)
    Hipbone.app.identityMap.storeAll(hashes, this)
