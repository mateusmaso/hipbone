Skull.Application::helpers['translate'] = Skull.Application::helpers['t'] = (key, options) ->
  
  Skull.app.i18n.t(key, options.hash)
