Module = require "./module"

module.exports = class Storage extends Module

  @registerModule "Storage"

  constructor: (prefix="hipbone_") ->
    @prefix = prefix

  match: (regex) ->
    matches = {}
    matches[key.replace(@prefix, "")] = JSON.parse(value) for key, value of localStorage when regex.test(key)
    matches

  get: (key) ->
    _.parse(value) if value = localStorage["#{@prefix}#{key}"]

  set: (key, value) ->
    localStorage.setItem("#{@prefix}#{key}", JSON.stringify(value))

  unset: (key) ->
    localStorage.removeItem("#{@prefix}#{key}")

  clear: ->
    regex = new RegExp(@prefix)
    @unset(key) for key, value of @match(regex)
