Module = require "./module"

module.exports = class IdentityMap extends Module

  @registerModule "IdentityMap"

  constructor: ->
    @instances = {}

  match: (regex) ->
    matches = {}
    matches[key] = instance.value for key, instance of @instances when regex.test(key)
    matches

  find: (key) ->
    @store(key, value) if value = @instances[key]?.value
    value

  findAll: (keys) ->
    values = []
    values.push(value) for key in keys when value = @find(key)
    values

  store: (key, value, options={}) ->
    defaults = value: value
    @instances[key] = _.extend(defaults, options)

  storeAll: (keys, value, options={}) ->
    @store(key, value, options) for key in keys

  delete: (key) ->
    delete @instances[key]

  deleteAll: (keys) ->
    @delete(key) for key in keys

  clear: ->
    @deleteAll(_.keys(@instances))
