class Hipbone.Storage extends Hipbone.Module

  match: (regex) ->
    matches = {}
    matches[key] = JSON.parse(value) for key, value of localStorage when regex.test(key)
    matches

  get: (key) ->
    _.parse(value) if value = localStorage[key]

  set: (key, value) ->
    localStorage.setItem(key, JSON.stringify(value))

  unset: (key) ->
    localStorage.removeItem(key)
