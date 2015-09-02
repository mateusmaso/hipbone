Hipbone.Application::initializers.push ->

  parseValue = Handlebars.parseValue
  Handlebars.parseValue = (value, bool) =>
    value = parseValue.apply(this, [value, bool])
    value = model if value and model = @identityMap.find(value.cid)
    value
