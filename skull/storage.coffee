class Skull.Storage extends Skull.Module

  constructor: (defaults) ->
    @set(key, value) for key, value of defaults when not @get(key)

  match: (regex) ->
    matches = {}
    matches[key] = JSON.parse(value) for key, value of localStorage when regex.test(key)
    matches

  get: (key) ->
    Skull.parse(value) if value = localStorage[key]

  set: (key, value) ->
    localStorage.setItem(key, JSON.stringify(value))

  unset: (key) ->
    localStorage.removeItem(key)