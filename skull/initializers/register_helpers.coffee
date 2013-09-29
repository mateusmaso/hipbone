Skull.Application::initializers.registerHelpers = ->

  for name, view of Skull.app.views
    do (name, view) ->
      name = _.string.dasherize(name).substring(1)
      Skull.app.helpers[name] = (options) -> 
        options.hash[key] = Skull.instance(value) for key, value of options.hash
        new view(options.hash).el

  for name, helper of Skull.app.helpers
    Handlebars.registerHelper(name, helper)