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
        property = _.string.camelize(attribute)
        @set(property, Handlebars.parseValue(value,  _.contains(@booleans, attribute))) unless _.contains(@internals, property)
