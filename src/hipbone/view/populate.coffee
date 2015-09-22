module.exports =

  initializePopulate: ->
    @deferreds = {}
    @background ||= false
    @defaults ||= {}
    @defaults.loading = false
    @internals ||= []
    @internals.push("loading")

    populated = @populated
    @populated = ->
      @background || populated.apply(this, arguments)

    populate = @populate
    @populate = ->
      if @background
        populate.apply(this, arguments)
      else
        @set(loading: true)
        populate.apply(this, arguments).done => @set(loading: false)

  populated: (name) ->
    false

  populate: (name) ->
    $.when(true)

  prepare: (name) ->
    deferred = @deferreds[name]

    if deferred and deferred.state() isnt "resolved"
      deferred
    else
      @deferreds[name] = $.when(@populated(name) || @populate(name))
