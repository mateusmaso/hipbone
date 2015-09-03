class TodoMVC.RootRoute extends Hipbone.Route

  matchUrl: "(/)"

  templateName: "/application"

  initialize: ->
    @set(todos: new TodoMVC.Todos())

  transition: ->
    return false if @withoutCurrentUser()

  fetch: ->
    @get("todos").fetch()

  buildUrl: ->
    "/"

  content: ->
    new TodoMVC.RootView(todos: @get("todos")).el
