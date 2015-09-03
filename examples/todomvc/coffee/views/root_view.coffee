class TodoMVC.RootView extends Hipbone.View

  templateName: "/root"

  elements:
    newTodo: ".new-todo"

  events:
    "keypress newTodo": "addTodo"

  addTodo: (event) ->
    return if event.keyCode isnt 13
    text = @$("newTodo").val()

    unless _.string.isBlank(text)
      @$("newTodo").val("")
      @get("todos").add(new TodoMVC.Todo(text: text))
