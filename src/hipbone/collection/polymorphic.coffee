module.exports =

  preparePolymorphic: (attributes, options={}) ->
    if not @_isModel(attributes) and _.isArray(@model)
      for Model in @model when Model::moduleName is @polymorphicType(attributes)
        return new Model(attributes, options)

  polymorphicId: (attributes={}) ->
    attributes[@polymorphicIdAttribute(attributes)]

  polymorphicType: (attributes={}) ->
    attributes[@polymorphicTypeAttribute(attributes)]

  polymorphicIdAttribute: (attributes={}) ->
    "id"

  polymorphicTypeAttribute: (attributes={}) ->
    "type"

  polymorphicUniqueId: (attributes={}) ->
    "#{@polymorphicId(attributes)}-#{@polymorphicType(attributes)}"
