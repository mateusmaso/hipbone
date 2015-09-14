module.exports =

  getNestedAttribute: (attribute) ->
    _.path(@attributes, attribute)

  setNestedAttribute: (attribute, value, options={}) ->
    paths = attribute.split(".")

    unless _.isEqual(@get(attribute), value)
      nestedAttributes = {}
      nestedAttributes[attribute] = value
      previousAttribute = @get(attribute)
      @attributes = _.pathExtend(@attributes, nestedAttributes)

      unless options.silent
        for path in _.clone(paths).reverse()
          attribute = paths.join(".")
          paths.pop()
          @nestedChanged[attribute] = value
          @trigger("change:#{attribute}", this, previousAttribute, options)

  setNestedAttributes: (attributes={}, options={}) ->
    @nestedChanged = {}
    for attribute, value of attributes when attribute.split(".").length > 1
      @setNestedAttribute(attribute, value, options)
      delete attributes[attribute]

  nestedChangeTrigger: (options) ->
    @trigger('change', this, options) if _.keys(@changed).length is 0 and _.keys(@nestedChanged).length isnt 0
