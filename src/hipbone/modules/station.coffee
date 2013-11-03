Hipbone.Station =

  initializeStation: (stations={}) ->
    @stations = _.extend({}, @stations, stations)
    @trigger = _.catenate(@trigger, @broadcast)
    @delegateStations(@stations)
  
  broadcast: (event, args...) ->
    Hipbone.app.trigger(event, args...)
    Hipbone.app.trigger("#{@moduleName()}.#{event}", args...)
    
  setStation: (key, callback) ->
    [event, scope] = key.match(/(\S+)/g)
    event = "#{scope}.#{event}" if scope
    @listenTo(Hipbone.app, event, callback)
  
  delegateStations: (stations={}) ->
    for key, callback of stations
      @setStation(key, @[callback])
  
  undelegateStations: ->
    @stopListening(Hipbone.app)