module.exports = ->

  Backbone.history = new Hipbone.History unless Backbone.history instanceof Hipbone.History
  @history = Backbone.history

  @on "run", ->
    @history.start(pushState: true) unless Backbone.History.started
    @trigger("start")
