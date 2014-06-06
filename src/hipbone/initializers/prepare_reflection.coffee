Hipbone.Application::initializers.push ->

  setReflection = (Module, attribute, value) ->
    if not Module::[attribute]? or _.isEqual(Module.__super__[attribute], Module::[attribute])
      Module::[attribute] = value

  for name, Model of @models
    Model::defaults = _.extend({}, _.clone(Model::defaults), type: name)
    setReflection(Model, "hashName", _.string.dasherize(name).substring(1))

  for name, Collection of @collections
    setReflection(Collection, "hashName", _.string.dasherize(name).substring(1))

  for name, View of @views
    booleans = []
    booleans.push(key) for key, value of View::defaults when _.isBoolean(value)

    setReflection(View, "booleans", booleans)
    setReflection(View, "elementName", _.string.dasherize(name).substring(1).replace("-view", ""))
