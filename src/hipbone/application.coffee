class Hipbone.Application extends Hipbone.Module
  
  @include Backbone.Events
  @include Hipbone.Ajax

  locales: {}
  helpers: {}
  initializers: {}

  constructor: (options={}) ->
    Hipbone.app = @

    @url ||= options.url || '/'
    @host ||= options.host || ''
    @prefix ||= options.prefix || ''
    @locale ||= options.locale || 'english'
    @routes ||= options.routes || {}
    @assets ||= options.assets || {}
    @locales ||= options.locales || {}
    @headers ||= options.headers || {}
    @helpers ||= options.helpers || {}
    @templates ||= options.templates || {}
    @initializers ||= options.initializers || {}
    @title ||= options.title || @constructor.name        

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

  initialize: ->

  run: ->
    initializer() for name, initializer of @initializers
    @router.start(pushState: true)

  fetch: (options={}) ->
    @ajax(_.extend(url: @url, options))

  setTitle: (title) ->
    document.title = title

  setSubtitle: (title) ->
    @setTitle("#{title} - #{@title}")
  