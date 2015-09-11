class TodoMVC.RootRoute extends Hipbone.Route

  url: "*all"

  templateName: "/application"

  initialize: ->
    @set(todos: app.get("todos"))

  toURL: ->
    "/"

  content: ->
    new TodoMVC.RootView(todos: @get("todos")).el
