module.exports =

  populated: (name) ->
    @synced

  populate: (name) ->
    @fetch()

  prepare: (name) ->
    $.when(@populated(name) || @populate(name))
