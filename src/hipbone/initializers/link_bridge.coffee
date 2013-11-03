Hipbone.Application::initializers.linkBridge = ->

  $('body').on "click", "a:not([bypass])", (event) ->
    if href = $(event.currentTarget).attr("href")
      event.preventDefault()
      Hipbone.app.router.navigate(href, trigger: true) 
