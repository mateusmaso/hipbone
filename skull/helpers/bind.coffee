Skull.Application::helpers['bind'] = (value, options) ->

  marker = $(document.createTextNode(""))
  delimiter = $(document.createTextNode(""))

  render = =>
    options.fn(@)

  append = =>
    element = Handlebars.parseHTML(render())
    marker.after(element)

  remove = =>
    next = marker[0].nextSibling
    while next and next isnt delimiter[0]
      _next = next.nextSibling
      $(next).remove()
      next = _next

  react = =>
    remove()
    append()

  observe = (value, context, keypath) =>
    if _.isArray(value)
      new ArrayObserver(value, react)
    else if _.isObject(value)
      new ObjectObserver(value, react)
    else
      new PathObserver(context, keypath, react)

  observer = observe(value, @, options.hash.keypath)
  element = Handlebars.parseHTML(render())
  [marker, element, delimiter]
