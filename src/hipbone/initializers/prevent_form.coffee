Hipbone.Application::initializers.preventForm = ->

  $('body').on "submit", "form:not([bypass])", (event) ->
    event.preventDefault()
