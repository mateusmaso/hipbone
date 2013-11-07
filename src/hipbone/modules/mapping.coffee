Hipbone.Mapping =

  initializeMapping: (mappings={}) ->
    @mappings = _.extend({}, @mappings, mappings)

  getMapping: (mapping) -> 
    @setMapping(mapping)

  setMapping: (mapping, value, options={}) ->
    type = @mappings[mapping]
    polymorphic = type is "Polymorphic"
        
    if polymorphic or Hipbone.app.models[type]
      attributes = value || {}

      if attributes instanceof Hipbone.Model
        model = attributes
      else
        attributes.id ||= @get("#{mapping}_id")
        attributes.type ||= @get("#{mapping}_type") || type
        model = new Hipbone.app.models[attributes.type](attributes, options) if attributes.id

      if model
        @set("#{mapping}_id", model.get('id'))
        @set("#{mapping}_type", model.get('type')) if polymorphic

      model
    else
      models = value
      options.parent = @
      options.meta = @get("#{mapping}_meta") || {}
      
      if models instanceof Hipbone.Collection
        collection = models
        collection.setParent(options.parent)
      else
        collection = new Hipbone.app.collections[type](models, options)

      collection
