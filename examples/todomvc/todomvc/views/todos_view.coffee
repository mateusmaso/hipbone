class TodoMVC.TodosView extends TodoMVC.View

  tagName: "ul"

  templateName: "/todos"

  className: "todo-list"

  initialize: ->
    @listenTo(@get("todos"), "update", @update)

  @register "TodosView"
