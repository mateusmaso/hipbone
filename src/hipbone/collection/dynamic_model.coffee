module.exports =

  prepareDynamicModel: (attributes, options={}) ->
    unless @_isModel(attributes)
      attributes = new (Hipbone.app.models[@parseModelType(attributes)] || @model)(attributes, options)

  parseModelType: (attributes={}) ->
    attributes.type

  dynamicModelId: (attributes={}) ->
    if @model and @_isModel(@model::)
      Model = @model
    else
      Model = Hipbone.app.models[@parseModelType(attributes)]

    "#{attributes[Model::typeAttribute]}-#{attributes[Model::idAttribute]}" if attributes[Model::idAttribute]
