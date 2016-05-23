RootView = require "../views/root_view"

module.exports = class ActiveRoute extends Hipbone.Route

  initialize: ->
    @set(todos: app.get("todos"))

  element: ->
    new RootView(todos: @get("todos")).el

  @register "ActiveRoute"
