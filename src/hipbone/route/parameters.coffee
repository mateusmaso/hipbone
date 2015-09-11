Model = require "./../model"

class Parameters extends Model

  @registerModule "Parameters"

module.exports =

  initializeParameters: (params={}, defaults={}) ->
    Parameters::defaults = defaults
    @params = @parameters = new Parameters(@parse(params))
    @listenTo @params, "all", => @trigger.apply(this, arguments)

  get: ->
    @params.get.apply(@params, arguments)

  set: ->
    @params.set.apply(@params, arguments)

  parse: (params={}) ->
    params
