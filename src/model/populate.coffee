$ = require "jquery"

module.exports =

  initializePopulate: ->
    @deferreds = {}

  populated: (name) ->
    if name
      @syncs[name]
    else
      @synced

  populate: (name) ->
    @fetch()

  prepare: (name) ->
    deferred = @deferreds[name]

    if deferred and not deferred.state() isnt "resolved"
      deferred
    else
      @deferreds[name] = $.when(@populated(name) || @populate(name))
