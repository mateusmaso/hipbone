module.exports =

  assignViewFor: (element) ->
    element.hipboneView = this

  $view: (selector) ->
    @$(selector)[0].hipboneView if @$(selector)[0]
