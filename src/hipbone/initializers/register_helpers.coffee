Hipbone.Application::initializers.push ->

  Handlebars.registerHelper 'asset', (key) ->
    Hipbone.app.assets[key]

  Handlebars.registerHelper 'template', (path, options) ->
    path = Hipbone.app.prefix + path
    context = if _.isEmpty(options.hash) then @ else options.hash
    template = Hipbone.app.templates[path](context)
    if options.hash.unescape
      template
    else
      new Handlebars.SafeString(template)

  Handlebars.registerHelper 'translate', (key, options) ->
    Hipbone.app.i18n.t(key, options.hash)

  Handlebars.registerHelper 't', (key, options) ->
    Hipbone.app.i18n.t(key, options.hash)

  eachHelper = Handlebars.helpers['each']
  Handlebars.registerHelper 'each', (items, options) ->
    items = items?.models || items
    eachHelper.apply(@, [items, options])

  ifHelper = Handlebars.helpers['if']
  Handlebars.registerHelper 'if', (conditional, options) ->
    if options.hash.bind and Hipbone.path(@, conditional)?.models
      conditional = conditional + ".models"
    else
      conditional = conditional?.models || conditional
    ifHelper.apply(@, [conditional, options])

