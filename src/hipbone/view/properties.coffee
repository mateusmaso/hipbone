Model = require "./../model"

class Properties extends Model

  @registerModule "Properties"

module.exports =

  initializeProperties: (properties={}, defaults={}) ->
    Properties::defaults = @defaults ||= defaults
    @props = @properties = new Properties(properties)
    @listenTo @props, "change", => @trigger("change")

  get: ->
    @props.get.apply(@props, arguments)

  set: ->
    @props.set.apply(@props, arguments)
