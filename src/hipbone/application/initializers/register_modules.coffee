module.exports = ->

  for moduleName, module of _.extend({}, @views, @models, @routes, @collections)
    module.registerModule(moduleName)
