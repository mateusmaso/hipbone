Hipbone.Application::initializers.notifyPlatform = ->

  Hipbone.app.on "all", ->
    Platform.performMicrotaskCheckpoint()
