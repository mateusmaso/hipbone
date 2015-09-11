class TodoMVC.CompletedRoute extends Hipbone.Route

  url: "completed(/)"

  templateName: "/application"

  initialize: ->
    @set(todos: app.get("todos"))

  toURL: ->
    "/completed"

  content: ->
    new TodoMVC.RootView(todos: @get("todos")).el
