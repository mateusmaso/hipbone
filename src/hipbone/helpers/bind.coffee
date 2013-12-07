Hipbone.Application::helpers['bind'] = (value, options) ->

  value = Hipbone.path(@, keypath = value)
  marker = $(document.createTextNode(""))
  delimiter = $(document.createTextNode(""))
  single = not options.fn

  render = =>
    options.fn(@)

  append = =>
    element = Handlebars.parseHTML(render())
    marker.after(element)

  remove = =>
    next = marker[0].nextSibling
    while next and next isnt delimiter[0]
      sibling = next.nextSibling
      $(next).remove()
      next = sibling

  react = (value) =>
    if single
      element[0].textContent = value
    else
      remove()
      append()

  observe = (value, context, keypath) =>
    if _.isArray(value)
      new ArrayObserver value, => react(value)
    else if _.isObject(value)
      new ObjectObserver value, => react(value)
    else
      new PathObserver context, keypath, (value) => react(value)

  observer = observe(value, @, keypath)

  if single
    element = $(document.createTextNode(value))
  else
    element = Handlebars.parseHTML(render())
    [marker, element, delimiter]
