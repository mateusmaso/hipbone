Model = require "./../model"

module.exports =

  initializeState: (state={}) ->
    @state = new (Model.define(defaults: @defaults))(state)
    @listenTo @state, "all", => @trigger.apply(this, arguments)

  get: ->
    @state.get.apply(@state, arguments)

  set: ->
    @state.set.apply(@state, arguments)
