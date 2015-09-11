module.exports =

  unsync: ->
    delete @synced
    @trigger('unsync', this)

  didSync: ->
    @synced = Date.now()
    @trigger('synced', this)
