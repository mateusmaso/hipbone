Hipbone.Application::initializers.push ->

  @on "run", ->
    @trigger("start", Hipbone.history.start(pushState: true))
