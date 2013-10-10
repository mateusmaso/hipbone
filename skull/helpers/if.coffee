Skull.Application::helpers['if'] = (conditional, options) ->

  marker = $(document.createTextNode(""))
  delimiter = $(document.createTextNode(""))
  status = false

  bool = (conditional) =>
    not conditional or Handlebars.Utils.isEmpty(conditional)

  render = (conditional) =>
    if status
      options.inverse(@)
    else
      options.fn(@)

  append = (conditional) =>
    element = Handlebars.parseHTML(render(conditional))
    marker.after(element)

  remove = =>
    next = marker[0].nextSibling
    while next and next isnt delimiter[0]
      sibling = next.nextSibling
      $(next).remove()
      next = sibling

  react = (conditional) =>
    if bool(conditional) isnt status
      status = bool(conditional)
      remove()
      append(conditional)

  observe = (conditional, context, keypath) =>
    if _.isArray(conditional)
      new ArrayObserver conditional, => react(conditional)
    else
      new PathObserver context, keypath, (conditional) => react(conditional)

  status = bool(conditional)

  if options.hash?.bind
    observer = observe(conditional, @, options.hash.keypath)
    element = Handlebars.parseHTML(render(conditional))
    [marker, element, delimiter]
  else
    render(conditional)
