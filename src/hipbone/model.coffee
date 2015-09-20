Module = require "./module"

module.exports = class Model extends Backbone.Model

  _.extend(this, Module)

  @include require "./model/sync"
  @include require "./model/store"
  @include require "./model/mappings"
  @include require "./model/populate"
  @include require "./model/validations"
  @include require "./model/nested_attributes"
  @include require "./model/computed_attributes"

  cidPrefix: "model"

  constructor: (attributes={}, options={}) ->
    return model if model = @initializeStore(attributes, options)
    @initializeMappings()
    @initializeValidations()
    @initializeComputedAttributes()
    super
    @on("all", => @store())
    @store()

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

  @register "Model"
