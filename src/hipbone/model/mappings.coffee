module.exports =

  initializeMappings: ->
    @transients = {}
    @mappings ||= {}

  mappingIdAttribute: (mapping) ->
    "#{mapping}_#{@parseMappingIdAttribute(mapping)}"

  mappingTypeAttribute: (mapping) ->
    "#{mapping}_#{@parseMappingTypeAttribute(mapping)}"

  mappingId: (mapping, attributes={}) ->
    attributes[@mappingIdAttribute(mapping)]

  mappingType: (mapping, attributes={}) ->
    attributes[@mappingTypeAttribute(mapping)]

  parseMappingIdAttribute: (mapping) ->
    "id"

  parseMappingTypeAttribute: (mapping) ->
    "type"

  parseMappingId: (mapping, attributes={}) ->
    attributes[@parseMappingIdAttribute(mapping)]

  parseMappingType: (mapping, attributes={}) ->
    attributes[@parseMappingTypeAttribute(mapping)]

  getMapping: (mapping) ->
    Module = @mappings[mapping].apply(this)
    if polymorphic = _.isArray(Module)
      Models = Module
      Module = Model for Model in Models when Model::moduleName is @mappingType(mapping, @attributes)

    if Module.prototype instanceof require("./../model")
      attributes = {}
      attributes[@parseMappingIdAttribute(mapping)] = id if id = @mappingId(mapping, @attributes)
      model = new Module(attributes) unless _.isEmpty(attributes)
    else if Module.prototype instanceof require("./../collection")
      collection = new Module(parent: this)

    model || collection || @transients[mapping]

  setMapping: (mapping, value, options={}) ->
    Module = @mappings[mapping].apply(this)
    if polymorphic = _.isArray(Module) and value
      Models = Module
      Module = Model for Model in Models when Model::moduleName is @parseMappingType(mapping, value)

    if value instanceof require("./../model")
      model = value
    else if value instanceof require("./../collection")
      collection = value
      collection.setParent(this)

    if not model and not collection
      if Module.prototype instanceof require("./../model") and value
        delete value[@parseMappingTypeAttribute(mapping)]
        model = new Module(value, options)
      else if Module.prototype instanceof require("./../collection")
        if _.isArray(value)
          models = value
        else if _.isObject(value)
          meta = value.meta
          models = value.models
        collection = new Module(models, _.extend(options, parent: this, meta: meta))

    if model
      @set(@mappingIdAttribute(mapping), @parseMappingId(mapping, model.attributes))
      @set(@mappingTypeAttribute(mapping), model.moduleName) if polymorphic
      @transients[mapping] = model if model.isNew()
    else if collection
      @transients[mapping] = collection
    else
      delete @transients[mapping]
      @unset(@mappingIdAttribute(mapping))
      @unset(@mappingTypeAttribute(mapping))

    model || collection

  setMappings: (attributes={}) ->
    for attribute, value of _.pick(attributes, _.keys(@mappings))
      @setMapping(attribute, value, parse: true)
      delete attributes[attribute]

  toJSONMappings: (mappings={}) ->
    json = {}
    json[mapping] = @getMapping(mapping)?.toJSON(options) for mapping, options of mappings
    json
