class Hipbone.Application extends Hipbone.Module

  @include Hipbone.Ajax
  @include Backbone.Events

  url: '/'

  title: 'App'

  locale: 'en'

  routes: {}

  assets: {}

  locales: {}

  templates: {}

  initializers: []

  templatePath: ''

  applicationOptions = ['url', 'title', 'locale', 'routes', 'assets', 'locales', 'templates', 'templatePath', 'initializers']

  constructor: (options={}) ->
    Hipbone.app = _.extend(this, _.pick(options, applicationOptions))

    @views = {}
    @models = {}
    @collections = {}
    @controllers = {}

    for name, method of _.pick(@constructor, _.functions(@constructor))
      @views[name] = method if method.prototype instanceof Hipbone.View
      @models[name] = method if method.prototype instanceof Hipbone.Model
      @collections[name] = method if method.prototype instanceof Hipbone.Collection
      @controllers[name] = method if method.prototype instanceof Hipbone.Controller

    @i18n = new Hipbone.I18n(@locales[@locale])
    @router = new Hipbone.Router
    @storage = new Hipbone.Storage
    @identityMap = new Hipbone.IdentityMap

    @initializeAjax(options.host, options.headers)
    @initialize(options)

    initializer.apply(this, [options]) for initializer in @initializers

  initialize: ->

  setTitle: (title) ->
    document.title = title

  setSubtitle: (title) ->
    @setTitle("#{title} - #{@title}")

  run: ->
    @router.match(route, @routes[route]) for route in _.keys(@routes).reverse()
    @router.start(pushState: true)
    @trigger("run", this)

  fetch: (options={}) ->
    @ajax(_.extend(url: @url, options))
