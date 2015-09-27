View = require "./../../view"

module.exports = ->

  Handlebars.registerHelper 'asset', (asset, options={}) =>
    @get("assets")[asset]

  Handlebars.registerHelper 't', (key, options={}) =>
    @i18n.t(key, options.hash)

  Handlebars.registerHelper 'url', (name, options={}) =>
    @router.matchUrl(name, options.hash)

  Handlebars.registerHelper 'fmt', (text, formats..., options={}) ->
    index = 0
    text.replace /%@/g, (format) -> formats[index++]

  Handlebars.registerHelper 'eval', (javascript, options={}) ->
    eval(javascript)

  Handlebars.registerHelper 'template', (path, options={}) ->
    template = @view.getTemplate(path)(@view.getContext(options.hash, this))
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
