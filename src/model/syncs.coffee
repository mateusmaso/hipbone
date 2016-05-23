module.exports =

  initializeSyncs: ->
    @syncs ||= {}

  unsync: (name) ->
    if name
      delete @syncs[name]
      @trigger("unsync:#{name}", this)
    else
      delete @synced
      @trigger("unsync", this)

  didSync: (name) ->
    if name
      @syncs[name] = @synced
      @trigger("synced:#{name}", this)
    else
      @synced = Date.now()
      @trigger("synced", name, this)
