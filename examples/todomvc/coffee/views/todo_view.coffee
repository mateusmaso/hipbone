class TodoMVC.TodoView extends Hipbone.View

  tagName: "li"

  templateName: "/todo"

  elements:
    destroy: ".destroy"

  events:
    "click destroy": "removeTodo"

  removeTodo: ->
    @get("todo").destroy()
