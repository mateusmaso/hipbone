currentElement = undefined

module.exports =

  initializeElement: (elementRoot) ->
    @elementRoot ||= elementRoot || document.body

  element: ->

  renderElement: ->
    @_element ||= @element()

    if currentElement isnt @_element
      $(currentElement).detach()

      if @elementRoot.hipboneView
        @elementRoot.hipboneView.setContent(@_element)
      else
        $(@elementRoot).append(@_element)

      currentElement = @_element
