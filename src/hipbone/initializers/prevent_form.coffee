Hipbone.Application::initializers.push ->

  $('body').on "submit", "form:not([bypass])", (event) ->
    event.preventDefault()
