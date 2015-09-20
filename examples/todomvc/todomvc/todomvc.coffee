class window.TodoMVC extends Hipbone.Application

  initializers: []

  locales: {}

  initialize: ->
    @set(todos: new TodoMVC.Todos(@storage.get("todos") || [{text: "um"}, {text: "dois"}, {text: "tres"}]))
    @listenTo @get("todos"), "update change", =>
      @storage.set("todos", @get("todos").toJSON(sync: true))

  @register "TodoMVC"
