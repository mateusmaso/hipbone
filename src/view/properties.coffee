_ = require "underscore"
dasherize = require "string-dasherize"
Model = require "./../model"

module.exports =

  initializeProperties: (properties={}) ->
    @internals ||= []
    @props = @properties = new (Model.define(defaults: @defaults))(_.omit(properties, @internals))
    @listenTo @props, "all", => @trigger.apply(this, arguments)

  get: ->
    @props.get.apply(@props, arguments)

  set: ->
    @props.set.apply(@props, arguments)

  mergeAttributes: (attributes={}) ->
    for attribute, value of @properties.attributes when not _.contains(@internals, attribute)
      attribute = dasherize(attribute || "")

      if attribute is "class"
        attributes[attribute] = "#{attributes[attribute]} #{value}".trim()
      else if _.contains(@booleans, attribute)
        attributes[attribute] = '' if value
      else if not _.isObject(value)
        attributes[attribute] = value

    attributes
