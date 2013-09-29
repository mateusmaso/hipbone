Skull.Instance =

  included: ->
    @extend
      find: (hash) ->
        @instances[hash]

      store: (hash, instance) ->
        @instances[hash] = instance   

      clear: ->
        for hash, instance of @instances when instance.expires < Date.now()
          delete @instances[hash] 

      tracked: (track) ->
        @trackings[track]

      track: (track, hash) ->
        @trackings[track] = hash

  makeInstance: ->
    @constructor.instances ||= {}
    @constructor.trackings ||= {}

    hash = @toHash.apply(@, arguments) || _.uniqueId("h")
    track = @toTrack.apply(@, arguments)

    instance = @constructor.find(hash)
    instance ||= @constructor.find(@constructor.tracked(track))

    if instance
      instance.prepareInstance(arguments...)
      instance
    else
      @setHash(hash)
      @setTrack(track)
      @expires = Date.now()
      @

  prepareInstance: ->

  toHash: ->

  setHash: (hash) ->
    @constructor.store(hash, @) if hash
    @hash = hash
  
  toTrack: ->

  setTrack: (track) ->
    @constructor.track(track, @hash) if track
