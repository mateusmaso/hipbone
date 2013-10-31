Skull.Mapping =

  initializeMapping: (mappings={}) ->
    @mappings = _.extend({}, @mappings, mappings)

  getMapping: (mapping) -> 
    @setMapping(mapping)

  setMapping: (mapping, value, options={}) ->
    type = @mappings[mapping]
    polymorphic = type is "Polymorphic"
        
    if polymorphic or Skull.app.models[type]
      attributes = value || {}
      model = attributes if attributes instanceof Skull.Model

      if model instanceof Skull.Model
        attributes = model.attributes
      else
        attributes.id ||= @get("#{mapping}_id")
        attributes.type ||= @get("#{mapping}_type") || type
        return unless attributes.id

      @set("#{mapping}_id", attributes.id)
      @set("#{mapping}_type", attributes.type) if polymorphic

      model || new Skull.app.models[attributes.type](attributes, options)
    else
      models = value
      options.parent = @
      options.meta = @get("#{mapping}_meta") || {}
      
      collection = models if models instanceof Skull.Collection
      collection || new Skull.app.collections[type](models, options)
