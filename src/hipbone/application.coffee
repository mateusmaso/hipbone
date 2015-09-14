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
    @initializeState(options.state, _.extend(title: "App", assets: {}, options.defaults))
    @initializeTemplates(options.templatePath, options.templates)
    @initializeViews(options.views)
    @initializeModels(options.models)
    @initializeRoutes(options.routes)
    @initializeCollections(options.collections)
    @initializeLocales(options.locale, options.locales)
    @initializeAjax(options.host, options.headers)
    @initializeInitializers(options.initializers)
    @router = new Hipbone.Router
    @storage = new Hipbone.Storage
    @runInitializers(options)
    @initialize(options)

  initialize: (options={}) ->

  run: ->
    @trigger('run')
