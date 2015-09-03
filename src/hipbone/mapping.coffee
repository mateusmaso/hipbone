Hipbone.Mapping =

  initializeMapping: (mappings={}, polymorphics=[]) ->
    @transients = {}
    @mappings = _.extend({}, @mappings, mappings)
    @polymorphics = _.union([], @polymorphics, polymorphics)

  mappingIdAttribute: (mapping) ->
    "#{mapping}_id"

  mappingTypeAttribute: (mapping) ->
    "#{mapping}_type"

  getMapping: (mapping) ->
    type = @mappings[mapping]

    if Hipbone.app.models[type] or _.contains(@polymorphics, mapping)
      id = @get(@mappingIdAttribute(mapping))
      type = @get(@mappingTypeAttribute(mapping)) || type
      attributes = {}
      attributes[Hipbone.app.models[type]::idAttribute] = id
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
    else if Hipbone.app.models[type] or _.contains(@polymorphics, mapping)
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
      @set(@mappingIdAttribute(mapping), model.id)
      @set(@mappingTypeAttribute(mapping), model.type) if _.contains(@polymorphics, mapping)
      @transients[mapping] = model if model.isNew()
    else if collection
      @transients[mapping] = collection
    else
      delete @transients[mapping]
      @unset(@mappingIdAttribute(mapping))
      @unset(@mappingTypeAttribute(mapping))

    model || collection

  parseMappingType: (mapping, attributes={}) ->
    attributes.type

  toJSONMappings: (mappings) ->
    json = {}
    json[mapping] = @getMapping(mapping)?.toJSON(options) for mapping, options of mappings
    json
