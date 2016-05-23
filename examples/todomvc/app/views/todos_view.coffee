View = require "./view"
TodoView = require "./todo_view"

module.exports = class TodosView extends View

  tagName: "ul"

  templateName: "/todos"

  className: "todo-list"

  initialize: ->
    @listenTo(@get("todos"), "update", @update)

  @register "TodosView"
