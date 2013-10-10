Skull.Application::initializers.linkBridge = ->

  $('body').on "click", "a:not([bypass])", (event) ->
    if href = $(event.currentTarget).attr("href")
      event.preventDefault()
      Skull.app.router.navigate(href, trigger: true) 
