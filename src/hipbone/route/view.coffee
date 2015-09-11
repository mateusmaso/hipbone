module.exports =

  initializeView: (templateName, contentTemplateName) ->
    @templateName ||= templateName || view::templateName
    @contentTemplateName ||= contentTemplateName
    @_content = null

  context: ->
    {}

  content: ->
    Hipbone.app.appView.template(@contentTemplateName, @context())

  render: ->
    @_content ||= @content()
    Hipbone.app.appView.set(@context())

    if Hipbone.app.appView.content isnt @_content
      Hipbone.app.appView.content = @_content
      Hipbone.app.appView.templateName = @templateName
      Hipbone.app.appView.$el.children().detach()
      Hipbone.app.appView.render()
