module.exports =

  initializeComputedAttributes: (computedAttributes={}) ->
    @computedAttributes = _.extend({}, @computedAttributes, computedAttributes)

  getComputedAttribute: (attribute) ->
    method = @computedAttributes[attribute]
    method = @[method] unless _.isFunction(method)
    method.apply(this) if method

  setComputedAttribute: (attribute, value) ->
    method = @computedAttributes[attribute]
    method = @[method] unless _.isFunction(method)
    method.apply(this, [value]) if method

  toJSONComputedAttributes: (computedAttributes) ->
    json = {}
    json[computedAttribute] = @getComputedAttribute(computedAttribute) for computedAttribute in computedAttributes
    json
