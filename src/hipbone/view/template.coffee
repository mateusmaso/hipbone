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
    @$el.html(@template(@templateName)) if @templateName
