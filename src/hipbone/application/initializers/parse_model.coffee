module.exports = ->

  parseValue = Handlebars.parseValue
  Handlebars.parseValue = (value, bool) =>
    value = parseValue.apply(this, [value, bool])
    value = model if value and model = Hipbone.Model::identityMap.find(value.cid) || Hipbone.Collection::identityMap.find(value.cid)
    value
