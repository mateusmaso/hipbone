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

    for name, klass of _.pick(@constructor, _.functions(@constructor))
      @views[name] = klass if klass.prototype instanceof Skull.View
      @models[name] = klass if klass.prototype instanceof Skull.Model
      @collections[name] = klass if klass.prototype instanceof Skull.Collection
      @controllers[name] = klass if klass.prototype instanceof Skull.Controller

    @i18n = new Skull.I18n(@locales[@locale])
    @router = new Skull.Router
    @storage = new Skull.Storage
    @initialize()

  initialize: ->

  setTitle: (title) ->
    document.title = title

  setSubtitle: (title) ->
    @setTitle("#{title} - #{@title}")

  run: ->
    initializer() for name, initializer of @initializers
    @trigger('ready')
    @router.start(pushState: true)

  fetch: (options) ->
    @ajax(_.extend(url: @url, options))
  