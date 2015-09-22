module.exports =

  active: ->

  beforeActivate: ->
    true

  activate: ->
    if @beforeActivate() isnt false
      @prepare().done =>
        @active()
        @trigger("active")
        @renderTitle()
        @renderElement()
