class TodoMVC.RootRoute extends Hipbone.Route

  matchUrl: "*all"

  templateName: "/application"

  initialize: ->
    @set(todos: new TodoMVC.Todos([
      {text: "um"},
      {text: "dois"},
      {text: "tres"}
    ]))

  buildUrl: ->
    "/"

  content: ->
    new TodoMVC.RootView(todos: @get("todos")).el
