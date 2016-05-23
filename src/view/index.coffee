_ = require "underscore"
Backbone = require "backbone"
Module = require "./../module"

module.exports = class View extends Backbone.View

  _.extend(this, Module)

  @include Backbone.Events
  @include require "./bubble"
  @include require "./content"
  @include require "./context"
  @include require "./populate"
  @include require "./elements"
  @include require "./template"
  @include require "./lifecycle"
  @include require "./properties"
  @include require "./class_name_bindings"

  constructor: (properties={}, options={}) ->
    @initializeContext()
    @initializeContent(options.content)
    @initializePopulate()
    @initializeTemplate()
    @initializeElements()
    @initializeProperties(properties)
    @initializeClassNameBindings()
    super(options)
    @lifecycle()
    @prepare()
    @render()
    @on("change", @update)

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
