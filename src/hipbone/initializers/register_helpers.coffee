Hipbone.Application::initializers.registerHelpers = ->

  for name, view of Hipbone.app.views
    do (name, view) ->
      name = _.string.dasherize(name).substring(1)
      Hipbone.app.helpers[name] = (options) -> 
        options.hash[key] = Hipbone.instance(value) for key, value of options.hash
        new view(options.hash).el

  for name, helper of Hipbone.app.helpers
    Handlebars.registerHelper(name, helper)