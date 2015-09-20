class TodoMVC.ActiveRoute extends Hipbone.Route

  initialize: ->
    @set(todos: app.get("todos"))

  element: ->
    new TodoMVC.RootView(todos: @get("todos")).el

  @register "ActiveRoute"
