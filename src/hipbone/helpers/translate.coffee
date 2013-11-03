Hipbone.Application::helpers['translate'] = Hipbone.Application::helpers['t'] = (key, options) ->
  
  Hipbone.app.i18n.t(key, options.hash)
