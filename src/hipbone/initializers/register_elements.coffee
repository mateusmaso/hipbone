Hipbone.Application::initializers.push ->

  for name, view of @views when name
    do (name, view) => 
      booleans = []    
      booleans.push(key) for key, value of view::defaults when _.isBoolean(value)
      name = _.string.dasherize(name).substring(1).replace("-view", "")

      Handlebars.registerElement name, ((attributes) ->
        attributes[key] = Hipbone.instance(value) for key, value of attributes
        new view(attributes, $(@).contents()).el
      ), booleans: booleans
        