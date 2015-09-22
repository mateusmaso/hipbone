class TodoMVC.TodoView extends TodoMVC.View

  tagName: "li"

  templateName: "/todo"

  elements:
    destroy: ".destroy"
    toggle: ".toggle"
    edit: ".edit"

  events:
    "click destroy": "removeTodo"
    "click toggle": "toggleTodo"
    "dblclick label": "editTodo"
    "blur edit": "stopEditTodo"
    'keyup edit': 'saveTodo'

  classNameBindings:
    editing: -> @get("editing")
    completed: -> @get("todo").get("completed")

  defaults:
    editing: false

  initialize: ->
    @listenTo(@get("todo"), "change", @update)

  removeTodo: ->
    @get("todo").destroy()

  toggleTodo: ->
    @get("todo").set(completed: not @get("todo").get("completed"))

  editTodo: ->
    @set(editing: true)

  stopEditTodo: ->
    @set(editing: false)

  saveTodo: (event) ->
    return if event.type is 'keyup' and event.keyCode isnt 13
    return @removeTodo() if _.string.isBlank(@$("edit").val())
    @get("todo").set(text: @$("edit").val())
    @stopEditTodo()

  @register "TodoView"
