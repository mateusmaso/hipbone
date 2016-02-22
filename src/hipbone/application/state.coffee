Model = require "./../model"

module.exports =

  initializeState: (state={}) ->
    @state = new (Model.define(defaults: @defaults, urlRoot: @urlRoot, parse: @parse))(state)
    @listenTo @state, "all", => @trigger.apply(this, arguments)

  fetch: ->
    @state.fetch.apply(@state, arguments)

  parse: (response) ->
    response

  get: ->
    @state.get.apply(@state, arguments)

  set: ->
    @state.set.apply(@state, arguments)
