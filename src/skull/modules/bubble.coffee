Skull.Bubble = 

  initializeBubble: (bubbles={}) ->
    @bubbles = _.extend({}, @bubbles, bubbles)
    @trigger = _.catenate(@trigger, @bubble)
    @delegateBubbles(@bubbles)

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

  delegateBubbles: (bubbles={}) ->
    for key, callback of bubbles
      @setBubble(key, @[callback])

  undelegateBubbles: ->
    @$el.off(".delegateBubbles")