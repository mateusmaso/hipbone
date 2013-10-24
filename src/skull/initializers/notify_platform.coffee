Skull.Application::initializers.notifyPlatform = ->

  Skull.app.on "all", ->
    Platform.performMicrotaskCheckpoint()
