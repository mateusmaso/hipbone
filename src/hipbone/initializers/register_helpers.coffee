Hipbone.Application::initializers.push ->

  for name, view of @views
    do (name, view) =>
      name = _.string.dasherize(name).substring(1)
      @helpers[name] = (options) -> 
        options.hash[key] = Hipbone.instance(value) for key, value of options.hash
        new view(options.hash).el

  for name, helper of @helpers
    Handlebars.registerHelper(name, helper)