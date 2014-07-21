Hipbone.Application::initializers.push ->

  Handlebars.registerHelper 'asset', (asset, options={}) ->
    Hipbone.app.assets[asset]

  Handlebars.registerHelper 't', (key, options={}) ->
    Hipbone.app.i18n.t(key, options.hash)

  Handlebars.registerHelper 'url', (name, options={}) ->
    Hipbone.app.router.buildUrl(name, options.hash)

  Handlebars.registerHelper 'fmt', (text, formats..., options={}) ->
    index = 0
    text.replace /%@/g, (format) -> formats[index++]

  Handlebars.registerHelper 'template', (path, options={}) ->
    path = Hipbone.app.templatePath + path
    context = if _.isEmpty(options.hash) then this else options.hash
    template = Hipbone.app.templates[path](context)
    if options.hash.unescape then template else new Handlebars.SafeString(template)

  eachHelper = Handlebars.helpers.each
  Handlebars.registerHelper 'each', (items, options={}) ->
    items = items.models || items if items
    eachHelper.apply(this, [items, options])

  ifHelper = Handlebars.helpers.if
  Handlebars.registerHelper 'if', (conditional, options={}) ->
    if options.hash.bind and _.path(this, conditional)?.models
      conditional = conditional + ".models"
    else if conditional
      conditional = conditional.models || conditional
    ifHelper.apply(this, [conditional, options])
