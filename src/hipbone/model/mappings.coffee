module.exports =

  initializeMappings: (mappings={}) ->
    @transients = {}
    @mappings = _.extend({}, @mappings, mappings)

  mappingIdAttribute: (mapping) ->
    "#{mapping}_#{@parseMappingIdAttribute(mapping)}"

  mappingTypeAttribute: (mapping) ->
    "#{mapping}_#{@parseMappingTypeAttribute(mapping)}"

  parseMappingIdAttribute: (mapping) ->
    "id"

  parseMappingTypeAttribute: (mapping) ->
    "type"

  parseMappingId: (mapping, attributes={}) ->
    attributes[@parseMappingIdAttribute(mapping)]

  parseMappingType: (mapping, attributes={}) ->
    attributes[@parseMappingTypeAttribute(mapping)]

  getMapping: (mapping) ->
    type = @mappings[mapping]

    if Hipbone.app.models[type]
      id = @get(@mappingIdAttribute(mapping))
      type = @get(@mappingTypeAttribute(mapping)) || type
      attributes = {}
      attributes[@parseMappingIdAttribute(mapping)] = id
      model = new Hipbone.app.models[type](attributes) if id
    else if Hipbone.app.collections[type]
      collection = new Hipbone.app.collections[type](parent: this)

    model || collection || @transients[mapping]

  setMapping: (mapping, value, options={}) ->
    type = @mappings[mapping]

    if value instanceof Hipbone.Model
      model = value
    else if value instanceof Hipbone.Collection
      collection = value
      collection.setParent(this)
    else if Hipbone.app.models[type]
      type = @parseMappingType(mapping, value) || type
      model = new Hipbone.app.models[type](value, options) if value
    else if Hipbone.app.collections[type]
      if _.isArray(value)
        models = value
      else if _.isObject(value)
        meta = value.meta
        models = value.models
      collection = new Hipbone.app.collections[type](models, _.extend(options, parent: this, meta: meta))

    if model
      @set(@mappingIdAttribute(mapping), @parseMappingId(mapping, model.attributes))
      @set(@mappingTypeAttribute(mapping), @parseMappingType(mapping, model.attributes)) if _.isArray(@mappings[mapping])
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
