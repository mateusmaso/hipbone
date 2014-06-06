Hipbone.Application::initializers.push ->

  for name, View of @views
    do (name, View) ->
      Handlebars.registerElement View::elementName, (attributes) ->
        new View(attributes, $(this).contents()).el
      , booleans: View::booleans
