Module = require "./module"

module.exports = class Application extends Module

  @registerModule "Application"

  @include Backbone.Events
  @include require "./application/ajax"
  @include require "./application/models"
  @include require "./application/routes"
  @include require "./application/views"
  @include require "./application/templates"
  @include require "./application/collections"
  @include require "./application/state"
  @include require "./application/locales"
  @include require "./application/initializers"

  constructor: (options={}) ->
    Hipbone.app = this
    @identityMap = new Hipbone.IdentityMap
    @initializeState(options.state, _.extend(title: "App", assets: {}, options.stateDefaults))
    @initializeTemplates(options.templatePath, options.templates)
    @initializeViews(options.views)
    @initializeModels(options.models)
    @initializeRoutes(options.routes)
    @initializeCollections(options.collections)
    @initializeLocales(options.locales, options.locale)
    @initializeAjax(options.ajaxHost, options.ajaxHeaders)
    @initializeInitializers(options.initializers)
    @history = Backbone.history = new Hipbone.History
    @router = new Hipbone.Router
    @storage = new Hipbone.Storage
    @runInitializers(options)
    @initialize(options)

  initialize: (options={}) ->

  run: ->
    @trigger('run')
