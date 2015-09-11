class window.TodoMVC extends Hipbone.Application

  initialize: ->
    @set todos: new TodoMVC.Todos([
      {text: "um"},
      {text: "dois"},
      {text: "tres"}
    ])
