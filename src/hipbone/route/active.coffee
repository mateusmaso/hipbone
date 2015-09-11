module.exports =

  beforeActive: ->
    true

  active: ->
    if @beforeActive() isnt false
      @updateTitle()
      @render()
