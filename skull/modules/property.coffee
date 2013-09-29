Skull.Property =

  initializeProperty: ->
    @properties ||= {}

  prepareProperty: (property) -> 
    method = @properties[property]
    method = @[method] unless _.isFunction(method)
    method.apply(@)
