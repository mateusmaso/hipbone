class Skull.Application extends Skull.Module
  
  @include Backbone.Events
  @include Skull.Ajax

  locales: {}
  helpers: {}
  initializers: {}

  constructor: (options={}) ->
    Skull.app = @

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
      @views[name] = method if method.prototype instanceof Skull.View
      @models[name] = method if method.prototype instanceof Skull.Model
      @collections[name] = method if method.prototype instanceof Skull.Collection
      @controllers[name] = method if method.prototype instanceof Skull.Controller

    @i18n = new Skull.I18n(@locales[@locale])
    @router = new Skull.Router
    @storage = new Skull.Storage
    @initialize()

  initialize: ->

  run: ->
    initializer() for name, initializer of @initializers
    @router.start(pushState: true)

  fetch: (options={}) ->
    @ajax(_.extend(url: @url, options))
  