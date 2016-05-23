$ = require "jquery"

module.exports =

  initializePopulate: ->
    @deferreds = {}

  populated: (name) ->
    @synced

  populate: (name) ->
    @fetch()

  prepare: (name) ->
    deferred = @deferreds[name]

    if deferred and deferred.state() isnt "resolved"
      deferred
    else
      @deferreds[name] = $.when(@populated(name) || @populate(name))
