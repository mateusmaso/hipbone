class Hipbone.Application extends Hipbone.Module
  
  @include Backbone.Events
  @include Hipbone.Ajax

  locales: {}
  initializers: []

  constructor: (options={}) ->
    Hipbone.app = @

    @url ||= options.url || '/'
    @host ||= options.host || ''
    @title ||= options.title || 'App'
    @prefix ||= options.prefix || ''
    @locale ||= options.locale || 'en'
    @routes ||= options.routes || {}
    @assets ||= options.assets || {}
    @locales ||= options.locales || {}
    @headers ||= options.headers || {}
    @templates ||= options.templates || {}
    @initializers ||= options.initializers || []

    @views ||= options.views || {}
    @models ||= options.models || {}
    @collections ||= options.collections || {}
    @controllers ||= options.controllers || {}

    for name, method of _.pick(@constructor, _.functions(@constructor))
      @views[name] = method if method.prototype instanceof Hipbone.View
      @models[name] = method if method.prototype instanceof Hipbone.Model
      @collections[name] = method if method.prototype instanceof Hipbone.Collection
      @controllers[name] = method if method.prototype instanceof Hipbone.Controller

    @i18n = new Hipbone.I18n(@locales[@locale])
    @router = new Hipbone.Router
    @storage = new Hipbone.Storage
    @initialize()

    initializer.apply(@) for initializer in @initializers

  initialize: ->

  run: ->
    @router.match(route, @routes[route]) for route in _.keys(@routes).reverse()
    @router.start(pushState: true)
    @trigger("run")

  fetch: (options={}) ->
    @ajax(_.extend(url: @url, options))

  setTitle: (title) ->
    document.title = title

  setSubtitle: (title) ->
    @setTitle("#{title} - #{@title}")
  