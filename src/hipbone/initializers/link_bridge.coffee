Hipbone.Application::initializers.push ->

  $('body').on "click", "a:not([bypass])", (event) =>
    if href = $(event.currentTarget).attr("href")
      event.preventDefault()
      @router.navigate(href, trigger: true) 
