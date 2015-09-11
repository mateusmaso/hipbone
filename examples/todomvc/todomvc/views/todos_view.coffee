class TodoMVC.TodosView extends Hipbone.View

  tagName: "ul"

  templateName: "/todos"

  className: "todo-list"

  initialize: ->
    @listenTo(@get("todos"), "update", @update)
