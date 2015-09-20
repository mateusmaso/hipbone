module.exports =

  preparePolymorphic: (attributes, options={}) ->
    if not @_isModel(attributes) and _.isArray(@model)
      for Model in @model when Model::moduleName is @polymorphicType(attributes)
        delete attributes[@polymorphicTypeAttribute(attributes)]
        return new Model(attributes, options)

  polymorphicType: (attributes={}) ->
    attributes[@polymorphicTypeAttribute(attributes)]

  polymorphicTypeAttribute: (attributes={}) ->
    "type"
