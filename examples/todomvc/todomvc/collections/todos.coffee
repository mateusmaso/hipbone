class TodoMVC.Todos extends Hipbone.Collection

  model: TodoMVC.Todo

  left: ->
    @filter (todo) -> not todo.get("completed")

  completed: ->
    @filter (todo) -> todo.get("completed")
