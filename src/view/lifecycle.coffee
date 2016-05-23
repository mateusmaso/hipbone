_ = require "underscore"
Handlebars = require "handlebars"
camelize = require "camelize"

module.exports =

  insert: ->

  detach: ->

  change: (attribute, value) ->

  lifecycle: ->
    @$el.lifecycle
      insert: =>
        @insert()
        @trigger("insert")
      remove: =>
        @detach()
        @trigger("detach")
      change: (attribute, value) =>
        @change(attribute, value)
        property = camelize(attribute)
        @set(property, Handlebars.parseValue(value,  _.contains(@booleans, property))) unless _.contains(@internals, property)
