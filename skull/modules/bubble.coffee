Skull.Bubble = 

  initializeBubble: ->
    @bubbles ||= {}
    @delegateBubbles(@bubbles)

    _trigger = @trigger
    @trigger = ->
      _trigger.apply(@, arguments)
      @bubble.apply(@, arguments)

  bubble: (event, args...) ->
    event = "bubble#{event}"
    @$el.trigger("#{@moduleName()}.#{event}", args)
    @$el.trigger(event, args)

  setBubble: (key, callback) ->
    [event, scope] = key.match(/(\S+)/g)
    event = "bubble#{event}"
    event = "#{scope}.#{event}" if scope
    event = "#{event}.delegateBubbles"
    @$el.on(event, _.bind(callback, @))

  delegateBubbles: (bubbles) ->
    for key, callback of bubbles
      @setBubble(key, @[callback])

  undelegateBubbles: ->
    @$el.off(".delegateBubbles")