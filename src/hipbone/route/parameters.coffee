module.exports =

  initializeParameters: (params={}) ->
    @parse = _.bind(@parse, this)
    @params = @parameters = new (Hipbone.Model.define(defaults: @defaults, parse: @parse))(params, parse: true)
    @listenTo @params, "all", => @trigger.apply(this, arguments)

  get: ->
    @params.get.apply(@params, arguments)

  set: ->
    @params.set.apply(@params, arguments)

  parse: (response={}) ->
    response
