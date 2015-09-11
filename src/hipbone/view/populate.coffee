module.exports =

  initializePopulate: (background) ->
    @background = false

    populated = @populated
    @populated = (name) ->
      @background || populated.apply(this, arguments)

    populate = @populate
    @populate = (name) ->
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
    $.when(@populated(name) || @populate(name))
