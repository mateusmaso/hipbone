module.exports = ->

  @on "run", ->
    @trigger("start", @history.start(pushState: true))
