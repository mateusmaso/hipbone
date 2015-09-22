Module = require "./module"

module.exports = class View extends Backbone.View

  _.extend(this, Module)

  @include Backbone.Events
  @include require "./view/store"
  @include require "./view/bubble"
  @include require "./view/content"
  @include require "./view/context"
  @include require "./view/populate"
  @include require "./view/elements"
  @include require "./view/template"
  @include require "./view/lifecycle"
  @include require "./view/properties"
  @include require "./view/class_name_bindings"

  constructor: (properties={}, options={}) ->
    return view if view = @initializeStore(properties)
    @initializeContext()
    @initializeContent(options.content)
    @initializePopulate()
    @initializeTemplate()
    @initializeElements()
    @initializeProperties(properties)
    @initializeClassNameBindings()
    super(options)
    @store()
    @lifecycle()
    @prepare()
    @render()
    @on("all", _.debounce => @store())
    @on("change", => @update())

  destroy: ->

  _setElement: ->
    @defineElement(super)

  _setAttributes: (attributes={}) ->
    super(@mergeAttributes(attributes))

  $: (selector) ->
    super(@getSelector(selector))

  update: ->
    @updateContextBindings()
    @updateClassNameBindings()

  render: ->
    @update()
    @renderTemplate()
    @renderContent()

  delegate: (eventName, selector, listener) ->
    super(eventName, @getSelector(selector), listener)

  remove: ->
    @destroy()
    super

  @register "View"
