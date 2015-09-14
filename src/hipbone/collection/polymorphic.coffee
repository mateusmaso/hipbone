module.exports =

  preparePolymorphic: (attributes, options={}) ->
    if _.isArray(@model) and not @_isModel(attributes)
      for Model in @model when Model is Hipbone.app.models[@polymorphicType(attributes)]
        return new Model(attributes, options)

  polymorphicType: (attributes={}) ->
    attributes.type
