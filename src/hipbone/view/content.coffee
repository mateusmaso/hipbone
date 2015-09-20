module.exports =

  initializeContent: (content) ->
    @content = content
    @container ||= undefined

  setContent: (content) ->
    if @content isnt content
      @content = content
      @renderContent()

  renderContent: ->
    if @content
      if @container
        @$(@container).append(@content)
      else
        @$el.append(@content)
