module.exports =

  title: ->
    Hipbone.app.get("title")

  updateTitle: ->
    document.title = @title()
