class Hipbone.IdentityMap extends Hipbone.Module

  constructor: ->
    @instances = {}

  find: (key) ->
    @instances[key]

  findAll: (keys) ->
    values = []
    values.push(value) for key in keys when value = @find(key)
    values

  store: (key, value) ->
    @instances[key] = value

  storeAll: (keys, value) ->
    @store(key, value) for key in keys
