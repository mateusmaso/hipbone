class Hipbone.Application extends Hipbone.Module

  @include Hipbone.Ajax
  @include Backbone.Events

  locales: {}

  initializers: []

  constructor: (options={}) ->
    Hipbone.app = this

    @url ||= options.url
    @root ||= options.root || 'body'
    @views ||= options.views || {}
    @title ||= options.title || 'App'
    @locale ||= options.local || 'en'
    @models ||= options.models || {}
    @routes ||= options.routes || {}
    @assets ||= options.assets || {}
    @templates ||= options.templates || {}
    @collections ||= options.collections || {}
    @controllers ||= options.controllers || {}
    @templatePath ||= options.templatePath || ''

    @locales = options.locales if options.locales
    @initializers = options.initializers if options.initializers

    @i18n = new Hipbone.I18n(@locales[@locale])
    @router = new Hipbone.Router
    @storage = new Hipbone.Storage
    @identityMap = new Hipbone.IdentityMap

    @initializeAjax(options.host, options.headers)
    @initialize(options)

    initializer.apply(this, [options]) for initializer in @initializers

  initialize: ->

  configure: ->

  prepare: ->
    fetching = @ajax(url: @url) if @url
    $.when(fetching)

  setTitle: (title) ->
    document.title = title

  setSubtitle: (title) ->
    @setTitle("#{title} - #{@title}")

  run: ->
    $.when(@prepare()).done (response) =>
      @configure(response)
      @appView = new @views.ApplicationView
      @router.match(route, @routes[route]) for route in _.keys(@routes).reverse()
      @router.start(pushState: true)
      @trigger("run")
