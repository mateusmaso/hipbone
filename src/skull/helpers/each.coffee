Skull.Application::helpers['each'] = (items, options) ->

  marker = $(document.createTextNode(""))
  markers = []
  delimiter = $(document.createTextNode(""))
  delimiters = []
  elements = []
  empty = false

  render = (items) =>
    output = ""
    output += renderItem(item, index) for item, index in items
    output = renderEmpty() if empty
    output

  renderItem = (item, index) =>
    context = _.extend({}, @, index: index)
    context[options.hash.var] = item
    options.fn(context)

  renderEmpty = =>
    options.inverse(@)

  appendEmpty = =>
    marker.after(Handlebars.parseHTML(renderEmpty()))

  appendItem = (item, index) =>
    if options.hash.single
      itemElement = Handlebars.parseHTML(renderItem(item, index))

      previous = elements[index - 1] || marker
      previous.after(itemElement)

      elements.splice(index, 0, itemElement)
    else
      itemMarker = $(document.createTextNode(""))
      itemDelimiter = $(document.createTextNode(""))
      itemElement = Handlebars.parseHTML(renderItem(item, index))

      previous = delimiters[index - 1] || marker
      previous.after(itemMarker, itemElement, itemDelimiter)

      markers.splice(index, 0, itemMarker)
      delimiters.splice(index, 0, itemDelimiter)

  remove = =>
    next = marker[0].nextSibling
    while next and next isnt delimiter[0]
      sibling = next.nextSibling
      $(next).remove()
      next = sibling

  removeItem = (item, index) =>
    if options.hash.single
      elements[index].remove()
      elements.splice(index, 1)
    else
      next = markers[index][0].nextSibling
      while next and next isnt delimiters[index][0]
        sibling = next.nextSibling
        $(next).remove()
        next = sibling

      markers[index].remove()
      delimiters[index].remove()

      markers.splice(index, 1)
      delimiters.splice(index, 1)

  react = (splice) =>  
    if items.length is 0 and not empty
      empty = true
      appendEmpty()
    
    if items.length > 0 and empty
      empty = false
      remove()

    if splice.removed.length > 0
      for index in [splice.index..splice.index + splice.removed.length - 1]
        removeItem(items[index], index)

    if splice.addedCount > 0
      for index in [splice.index..splice.index + splice.addedCount - 1]
        appendItem(items[index], index)

  observe = (items) =>
    new ArrayObserver items, (splices) => react(splice) for splice in splices

  empty = items.length is 0

  if options.hash?.bind
    observer = observe(items)
    element = []

    for item, index in items
      if options.hash.single
        itemElement = elements[index] = Handlebars.parseHTML(renderItem(item, index))
        element.push(itemElement)
      else
        itemMarker = markers[index] = $(document.createTextNode(""))
        itemDelimiter = delimiters[index] = $(document.createTextNode(""))
        itemElement = Handlebars.parseHTML(renderItem(item, index))
        element.push(itemMarker, itemElement, itemDelimiter)
    if empty
      element = Handlebars.parseHTML(renderEmpty())

    _.flatten([marker, element, delimiter])
  else
    render(items)
