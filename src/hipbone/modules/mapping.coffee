Hipbone.Mapping =

  initializeMapping: (mappings={}) ->
    @mappings = _.extend({}, @mappings, mappings)
    @transients = {}

  getMapping: (mapping) -> 
    type = @mappings[mapping]

    if type is "Polymorphic" or Hipbone.app.models[type]
      if @get("#{mapping}_id")
        @setMapping(mapping, id: @get("#{mapping}_id"), type: @get("#{mapping}_type") || type)
      else
        @transients[mapping]
    else
      @setMapping(mapping, null, parent: @, meta: @get("#{mapping}_meta"))

  setMapping: (mapping, value, options={}) ->
    type = @mappings[mapping]
        
    if type is "Polymorphic" or Hipbone.app.models[type]
      attributes = value

      if attributes instanceof Hipbone.Model
        model = attributes
      else if attributes
        model = new Hipbone.app.models[attributes.type](attributes, options)

      if model
        if model.isNew()
          @transients[mapping] = model
          @unset("#{mapping}_id")
          @unset("#{mapping}_type")
        else
          @set("#{mapping}_id", model.get('id'))
          @set("#{mapping}_type", model.get('type')) if type is "Polymorphic"
          delete @transients[mapping]

          @listenTo model, "destroy", =>
            @unset("#{mapping}_id")
            @unset("#{mapping}_type")
      else
        @unset("#{mapping}_id")
        @unset("#{mapping}_type")
        delete @transients[mapping]

      model
    else
      models = value
      
      if models instanceof Hipbone.Collection
        collection = models
        collection.setParent(options.parent)
      else
        collection = new Hipbone.app.collections[type](models, options)

      collection
