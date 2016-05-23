_ = require "underscore"
Backbone = require "backbone"

store = {}
keywords = ['included', 'extended']

prepare = (module) ->
  superclass = module.__super__.constructor
  cid = _.uniqueId("module")
  store[cid] = module
  module.cid = cid
  module.subclasses = []
  module.includedModules = _.clone(superclass.includedModules || [])
  module.extendedModules = _.clone(superclass.extendedModules || [])
  superclass.subclasses.push(module) if superclass.subclasses

module.exports = class Module

  moduleName: "Module"

  @register: (name) ->
    prepare(this) if store[@cid] isnt this
    @::moduleName = name
    module.registered.apply(this) for module in @includedModules when module.registered
    module.registered.apply(this) for module in @extendedModules when module.registered

  @include: (modules...) ->
    prepare(this) if store[@cid] isnt this
    for module in modules
      @includedModules.push(module)
      @::[name] = method for name, method of module when name not in keywords
      module.included.apply(this) if module.included
      module.registered.apply(this) if module.registered

  @extend: (modules...) ->
    prepare(this) if store[@cid] isnt this
    for module in modules
      @extendedModules.push(module)
      @[name] = method for name, method of module when name not in keywords
      module.extended.apply(this) if module.extended
      module.registered.apply(this) if module.registered

  @define: Backbone.Model.extend
