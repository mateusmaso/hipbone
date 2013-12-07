Hipbone.Application::initializers.push ->

  @on "all", ->
    Platform.performMicrotaskCheckpoint()
