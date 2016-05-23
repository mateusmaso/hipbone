_ = require "underscore"

module.exports =

  initializeParams: ->
    @params ||= {}

  updateParams: (params={}) ->
    @params = _.extend(@history.getQuery(), params)
