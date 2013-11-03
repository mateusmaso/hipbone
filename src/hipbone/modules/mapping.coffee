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
      model = attributes if attributes instanceof Hipbone.Model

      if model instanceof Hipbone.Model
        attributes = model.attributes
      else
        attributes.id ||= @get("#{mapping}_id")
        attributes.type ||= @get("#{mapping}_type") || type
        return unless attributes.id

      @set("#{mapping}_id", attributes.id)
      @set("#{mapping}_type", attributes.type) if polymorphic

      model || new Hipbone.app.models[attributes.type](attributes, options)
    else
      models = value
      options.parent = @
      options.meta = @get("#{mapping}_meta") || {}
      
      collection = models if models instanceof Hipbone.Collection
      collection || new Hipbone.app.collections[type](models, options)
