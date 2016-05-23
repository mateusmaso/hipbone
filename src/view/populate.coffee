$ = require "jquery"

module.exports =

  initializePopulate: ->
    @deferreds = {}
    @background ||= false
    @defaults ||= {}
    @defaults.loading = false
    @internals ||= []
    @internals.push("loading")

  populated: (name) ->
    false

  populate: (name) ->
    $.when(true)

  prepare: (name) ->
    deferred = @deferreds[name]

    if deferred and deferred.state() isnt "resolved"
      deferred
    else
      populated = @populated(name)
      @set(loading: true) unless populated
      populated = false if @background
      @deferreds[name] = $.when(populated || @populate(name)).done => @set(loading: false)
