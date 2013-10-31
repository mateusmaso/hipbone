Skull.Property =

  initializeProperty: (properties={}) ->
    @properties = _.extend({}, @properties, properties)

  getProperty: (property) -> 
    method = @properties[property]
    method = @[method] unless _.isFunction(method)
    method.apply(@)
