module.exports =

  populated: (name) ->
    false

  populate: (name) ->
    $.when(true)

  prepare: (name) ->
    $.when(@populated(name) || @populate(name))
