Model = require "./../../model"
Collection = require "./../../collection"

module.exports = ->

  parseValue = Handlebars.parseValue
  Handlebars.parseValue = (value, bool) =>
    value = parseValue.apply(this, [value, bool])
    value = model if value and model = Model.identityMap.find(value.cid) || Collection.identityMap.find(value.cid)
    value
