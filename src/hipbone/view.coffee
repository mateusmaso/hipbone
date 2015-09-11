Module = require "./module"

module.exports = class View extends Backbone.View

  _.extend(this, Module)

  @registerModule "View"

  @include Backbone.Events
  @include require "./view/store"
  @include require "./view/bubble"
  @include require "./view/update"
  @include require "./view/content"
  @include require "./view/context"
  @include require "./view/booleans"
  @include require "./view/template"
  @include require "./view/populate"
  @include require "./view/elements"
  @include require "./view/attribute"
  @include require "./view/lifecycle"
  @include require "./view/properties"
  @include require "./view/view_selector"
  @include require "./view/class_name_bindings"

  constructor: (properties={}, content, options={}) ->
    return view if view = @initializeStore(options.hashName, properties)
    @initializeContext()
    @initializeContent(content, options.container)
    @initializePopulate(options.background)
    @initializeBooleans(options.booleans)
    @initializeElements(options.elementName, options.elements)
    @initializeTemplate(options.templateName)
    @initializeProperties(properties)
    @initializeClassNameBindings(options.classNameBindings)
    super
    @on("change", => @update())
    @on("all", => @store())
    @lifecycle()
    @prepare()
    @render()
    @store()

  destroy: ->

  _ensureElement: ->
    super
    @set(class: "#{@el.className} #{@get("class") || ''}")
    @_setAttributes(@properties.attributes)
    @assignViewFor(@el)

  _setAttributes: (attributes={}) ->
    @setAttribute(attribute, value) for attribute, value of attributes

  $: (selector) ->
    super(@getSelector(selector))

  render: ->
    @update(immediate: true)
    @renderTemplate()
    @renderContent()

  delegate: (eventName, selector, listener) ->
    super(eventName, @getSelector(selector), listener)

  remove: ->
    @destroy()
    super
