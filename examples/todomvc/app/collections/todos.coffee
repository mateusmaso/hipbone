Todo = require "../models/todo"

module.exports = class Todos extends Hipbone.Collection

  model: Todo

  left: ->
    @filter (todo) -> not todo.get("completed")

  completed: ->
    @filter (todo) -> todo.get("completed")

  @register "Todos"
