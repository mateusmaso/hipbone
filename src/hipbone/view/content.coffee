module.exports =

  initializeContent: (content, container) ->
    @content = content
    @container = container

  renderContent: ->
    if @content
      if @container
        @$(@container).append(@content)
      else
        @$el.append(@content)
