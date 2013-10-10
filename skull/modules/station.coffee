Skull.Station =

  initializeStation: ->
    @stations ||= {}
    @delegateStations(@stations)
    @trigger = _.catenate(@trigger, @broadcast)
  
  broadcast: (event, args...) ->
    Skull.app.trigger(event, args...)
    Skull.app.trigger("#{@moduleName()}.#{event}", args...)
    
  setStation: (key, callback) ->
    [event, scope] = key.match(/(\S+)/g)
    event = "#{scope}.#{event}" if scope
    @listenTo(Skull.app, event, callback)
  
  delegateStations: (stations) ->
    for key, callback of stations
      @setStation(key, @[callback])
  
  undelegateStations: ->
    @stopListening(Skull.app)