class Hipbone.Application extends Hipbone.Module

  @include Hipbone.Ajax
  @include Hipbone.Accessor
  @include Backbone.Events

  locales: {}

  initializers: []

  constructor: (options={}) ->
    Hipbone.app = this

    @views ||= options.views || {}
    @title ||= options.title || 'App'
    @locale ||= options.local || 'en'
    @models ||= options.models || {}
    @assets ||= options.assets || {}
    @routes ||= options.routes || {}
    @matches ||= options.matches || []
    @templates ||= options.templates || {}
    @collections ||= options.collections || {}
    @templatePath ||= options.templatePath || ''

    @locales = options.locales if options.locales
    @initializers = options.initializers if options.initializers

    @i18n = new Hipbone.I18n(@locales[@locale])
    @router = new Hipbone.Router(matches: @matches)
    @storage = new Hipbone.Storage
    @identityMap = new Hipbone.IdentityMap

    @initializeAccessor(accessorsName: "attributes", accessors: options.attributes)
    @initializeAjax(options.host, options.headers)
    @initialize(options)

    initializer.apply(this, [options]) for initializer in @initializers

  initialize: ->

  run: ->
    @trigger('run')
