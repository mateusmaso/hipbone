_ = require "underscore"
Model = require "./../model/index"

module.exports =

  initializeParameters: (params={}) ->
    @parse = _.bind(@parse, this)
    @params = @parameters = new (Model.define(defaults: @defaults, parse: @parse))(params, parse: true)
    @listenTo @params, "all", => @trigger.apply(this, arguments)

  get: ->
    @params.get.apply(@params, arguments)

  set: ->
    @params.set.apply(@params, arguments)

  parse: (response={}) ->
    response
