module.exports =

  initializeTemplate: ->
    @templates ||= {}
    @templatePath ||= ""
    @templateName ||= ""

  template: (path, context) ->
    $(Handlebars.parseHTML(@getTemplate(path)(@getContext(context))))

  getTemplate: (path) ->
    @templates["#{@templatePath}#{path}"]

  renderTemplate: ->
    Handlebars.unbind(@el)
    @$el.html(@template(@templateName)) if @templateName
