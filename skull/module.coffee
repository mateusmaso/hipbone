class Skull.Module

  moduleKeywords = ['included', 'extended']

  @include: (modules...) ->
    for module in modules
      for name, method of module when name not in moduleKeywords
        @::[name] = method
      module.included.apply(@) if module.included

  @extend: (modules...) ->
    for module in modules
      for name, method of module when name not in moduleKeywords
        @[name] = method
      module.extended.apply(@) if module.extended

  moduleName: ->
    _.string.underscored(@constructor.name)

for module in ['Model', 'Collection', 'Router', 'View', 'History']
  Backbone[module] = _.extend(Backbone[module], Skull.Module)
  Backbone[module]:: = _.extend(Backbone[module]::, Skull.Module::)