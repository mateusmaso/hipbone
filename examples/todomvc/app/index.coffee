Todos = require "./collections/todos"

module.exports = class window.TodoMVC extends Hipbone.Application

  initializers: [
    require("./initializers/match_routes"),
    require("./initializers/register_attributes")
  ]

  locales:
    en: require("./locales/en")

  initialize: ->
    @set(todos: new Todos(@storage.get("todos") || [{text: "um"}, {text: "dois"}, {text: "tres"}]))
    @listenTo @get("todos"), "update change", =>
      @storage.set("todos", @get("todos").toJSON(sync: true))

  @register "TodoMVC"
