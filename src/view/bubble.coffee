module.exports =

  bubble: (eventName, args...) ->
    @trigger(arguments...)
    @$el.trigger(eventName, args)
