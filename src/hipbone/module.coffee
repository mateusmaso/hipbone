module.exports = class Module

  modules = []
  moduleKeywords = ['included', 'extended']

  moduleName: "Module"

  @registerModule: (name) ->
    @::moduleName = name
    modules[name] = this

  @include: (modules...) ->
    for module in modules
      @::[name] = method for name, method of module when name not in moduleKeywords
      module.included.apply(this) if module.included

  @extend: (modules...) ->
    for module in modules
      @[name] = method for name, method of module when name not in moduleKeywords
      module.extended.apply(this) if module.extended
