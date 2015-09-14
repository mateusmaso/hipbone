Module = require "./module"

module.exports = class Model extends Backbone.Model

  _.extend(this, Module)

  @registerModule "Model"

  @include require "./model/sync"
  @include require "./model/store"
  @include require "./model/mappings"
  @include require "./model/populate"
  @include require "./model/validations"
  @include require "./model/nested_attributes"
  @include require "./model/computed_attributes"

  cidPrefix: "model"

  constructor: (attributes={}, options={}) ->
    return model if model = @initializeStore(options.hashName, attributes, options)
    @initializeMappings(options.mappings)
    @initializeValidations(options.validations)
    @initializeComputedAttributes(options.computedAttributes)
    super
    @on("all", => @store())
    @store()

  get: (attribute) ->
    if @mappings[attribute] or _.contains(@polymorphics, attribute)
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
    @nestedChangeTrigger(options)

  toJSON: (options={}) ->
    mappings = options.mappings || {}
    mappingOptions.sync = options.sync for mapping, mappingOptions of mappings
    computedAttributes = options.computedAttributes || _.keys(@computedAttributes)
    json = _.deepClone(super)
    json = _.extend(cid: @cid, json, @toJSONComputedAttributes(computedAttributes), @toJSONMappings(mappings)) unless options.sync
    json

  parse: (response={}) ->
    @didSync()
    response
