module.exports =

  setAttribute: (attribute, value) ->
    attribute = _.string.dasherize(attribute)

    if attribute is "class"
      @$el.addClass(value)
    else if _.contains(@booleans, attribute)
      @$el.attr(attribute, '') if value
    else if not _.isObject(value)
      @$el.attr(attribute, value)
