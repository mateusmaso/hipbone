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
        attribute = _.string.camelize(attribute)
        @set(attribute, Handlebars.parseValue(value,  _.contains(@booleans, attribute)))
