module.exports =

  initializeFilters: ->
    @filters ||= {}

  toJSONFilters: (options={}) ->
    json = {}
    for attribute, value of @filters
      value = value.apply(this, [options]) if _.isFunction(value)
      json[attribute] = value if value?
    json
