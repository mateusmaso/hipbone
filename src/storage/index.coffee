_ = require "underscore"
Module = require "./../module"

module.exports = class Storage extends Module

  constructor: (prefix="hipbone_") ->
    @prefix = prefix

  match: (regex) ->
    matches = {}
    matches[key.replace(@prefix, "")] = _.parse(value).data for key, value of localStorage when regex.test(key) and key.indexOf(@prefix) >= 0
    matches

  get: (key) ->
    _.parse(value).data if value = localStorage["#{@prefix}#{key}"]

  set: (key, value) ->
    localStorage.setItem("#{@prefix}#{key}", JSON.stringify(data: value, timestamp: _.now()))

  unset: (key) ->
    localStorage.removeItem("#{@prefix}#{key}")

  clear: ->
    regex = new RegExp(@prefix)
    @unset(key) for key, value of @match(regex)

  @register "Storage"
