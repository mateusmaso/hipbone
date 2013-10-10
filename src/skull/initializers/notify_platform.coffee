Skull.Application::initializers.notifyPlatform = ->

  Skull.app.on "update", ->
    Platform.performMicrotaskCheckpoint()
