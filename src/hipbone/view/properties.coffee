module.exports =

  initializeProperties: (properties={}) ->
    @internals ||= []
    @props = @properties = new (Hipbone.Model.define(defaults: @defaults))(_.omit(properties, @internals))
    @listenTo @props, "change", => @trigger("change")

  get: ->
    @props.get.apply(@props, arguments)

  set: ->
    @props.set.apply(@props, arguments)

  mergeAttributes: (attributes={}) ->
    for attribute, value of @properties.attributes when not _.contains(@internals, attribute)
      attribute = _.string.dasherize(attribute)

      if attribute is "class"
        attributes[attribute] = "#{attributes[attribute]} #{value}".trim()
      else if _.contains(@booleans, attribute)
        attributes[attribute] = '' if value
      else if not _.isObject(value)
        attributes[attribute] = value

    attributes
