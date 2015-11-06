module.exports =

  initializePopulate: ->
    @deferreds = {}

  populated: (name) ->
    false

  populate: (name) ->
    $.when(true)

  prepare: (name) ->
    deferred = @deferreds[name]

    if deferred and deferred.state() isnt "resolved"
      deferred
    else
      @deferreds[name] = $.when(@populated(name) || @populate(name))
