Hipbone.Application::helpers['template'] = (path, options) ->
  
  path = Hipbone.app.prefix + path
  context = if _.isEmpty(options.hash) then @ else options.hash
  new Handlebars.SafeString(Hipbone.app.templates[path](context))
