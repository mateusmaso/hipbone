module.exports =

  included: ->
    @booleans = ->
      booleans = []
      booleans.push(key) for key, value of @::defaults when _.isBoolean(value)
      booleans

  initializeBooleans: (booleans) ->
    @booleans = booleans if booleans
