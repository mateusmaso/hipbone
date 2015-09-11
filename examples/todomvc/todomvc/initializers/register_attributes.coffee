TodoMVC::initializers.push ->

  Handlebars.registerAttribute 'autofocus', (element) ->
    attribute = document.createAttribute('autofocus')
    attribute.value = @value
    attribute
  , ready: (element) ->
    $(element).lifecycle
      insert: _.once =>
        _.defer =>
          $(element).focus()
