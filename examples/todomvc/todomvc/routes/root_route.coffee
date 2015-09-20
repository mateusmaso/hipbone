class TodoMVC.RootRoute extends Hipbone.Route

  initialize: ->
    @set(todos: app.get("todos"))

  element: ->
    new TodoMVC.RootView(todos: @get("todos")).el

  @register "RootRoute"
