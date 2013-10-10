Skull.Application::helpers['template'] = (path, options) ->
  
  path = Skull.app.prefix + path
  context = if _.isEmpty(options.hash) then @ else options.hash
  new Handlebars.SafeString(Skull.app.templates[path](context))
