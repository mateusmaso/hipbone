module.exports =

  initializeProperties: (properties={}) ->
    @props = @properties = new Hipbone.Model(properties)
    @listenTo @props, "change", => @trigger("change")

  get: ->
    @props.get.apply(@props, arguments)

  set: ->
    @props.set.apply(@props, arguments)
