_ = require "underscore"
Backbone = require "backbone"
Module = require "./../module"

module.exports = class Model extends Backbone.Model

  _.extend(this, Module)

  @include require "./syncs"
  @include require "./store"
  @include require "./schemes"
  @include require "./mappings"
  @include require "./populate"
  @include require "./validations"
  @include require "./nested_attributes"
  @include require "./computed_attributes"

  cidPrefix: "model"

  constructor: (attributes={}, options={}) ->
    return model if model = @initializeStore(attributes, options)
    @initializeSyncs()
    @initializeSchemes()
    @initializePopulate()
    @initializeMappings()
    @initializeValidations()
    @initializeComputedAttributes()
    super
    @storeChanges()

  get: (attribute) ->
    if @mappings[attribute]
      @getMapping(attribute)
    else if @computedAttributes[attribute]
      @getComputedAttribute(attribute)
    else
      @getNestedAttribute(attribute)

  set: (attribute, value, options={}) ->
    if _.isObject(attribute)
      attributes = attribute
      options = value || {}
    else
      attributes = {}
      attributes[attribute] = value

    @setMappings(attributes, options)
    @setNestedAttributes(attributes, options)
    super(attributes, options)
    @triggerNestedChange(options)
    this

  toJSON: (options={}) ->
    mappings = options.mappings || {}
    mappingOptions.sync = options.sync for mapping, mappingOptions of mappings
    computedAttributes = options.computedAttributes || _.keys(@computedAttributes)
    json = _.deepClone(super)
    json = _.extend(cid: @cid, json, @toJSONComputedAttributes(computedAttributes), @toJSONMappings(mappings)) unless options.sync
    json

  parse: (response={}) ->
    @didSync()
    @didSync(schema) for schema in @validateSchemes(response)
    response

  @register "Model"
