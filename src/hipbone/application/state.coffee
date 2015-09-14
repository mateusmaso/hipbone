Model = require "./../model"

class State extends Model

  @registerModule "State"

module.exports =

  initializeState: (state={}, defaults={}) ->
    State::defaults = @defaults ||= defaults
    @state = new State(state)
    @listenTo @state, "all", => @trigger.apply(this, arguments)

  get: ->
    @state.get.apply(@state, arguments)

  set: ->
    @state.set.apply(@state, arguments)
