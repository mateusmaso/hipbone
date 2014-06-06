class Hipbone.Module

  moduleKeywords = ['included', 'extended']

  @include: (modules...) ->
    for module in modules
      @::[name] = method for name, method of module when name not in moduleKeywords
      module.included.apply(this) if module.included

  @extend: (modules...) ->
    for module in modules
      @[name] = method for name, method of module when name not in moduleKeywords
      module.extended.apply(this) if module.extended

for module in ['Model', 'Collection', 'Router', 'View', 'History']
  Backbone[module] = _.extend(Backbone[module], Hipbone.Module)
  Backbone[module]:: = _.extend(Backbone[module]::, Hipbone.Module::)