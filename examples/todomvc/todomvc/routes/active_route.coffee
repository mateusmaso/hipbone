class TodoMVC.ActiveRoute extends Hipbone.Route

  url: "active(/)"

  templateName: "/application"

  initialize: ->
    @set(todos: app.get("todos"))

  toURL: ->
    "/active"

  content: ->
    new TodoMVC.RootView(todos: @get("todos")).el
