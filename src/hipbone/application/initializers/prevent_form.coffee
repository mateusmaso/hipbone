module.exports = ->

  $('body').on "submit", "form:not([bypass])", (event) ->
    event.preventDefault()
