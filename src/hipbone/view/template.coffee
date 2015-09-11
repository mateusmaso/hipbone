module.exports =

  initializeTemplate: (templateName) ->
    @templateName ||= templateName

  template: (path, context) ->
    $(Handlebars.parseHTML(@getTemplate(path)(@getContext(context))))

  getTemplate: (path) ->
    Hipbone.app.getTemplate(path)

  renderTemplate: ->
    @$el.html(@template(@templateName)) if @templateName
