module.exports =

  initializeInitializers: ->
    @initializers ||= []
    @initializers.unshift(require("./initializers/parse_body"))
    @initializers.unshift(require("./initializers/parse_model"))
    @initializers.unshift(require("./initializers/link_bridge"))
    @initializers.unshift(require("./initializers/prevent_form"))
    @initializers.unshift(require("./initializers/register_helpers"))

  runInitializers: (options) ->
    initializer.apply(this, [options]) for initializer in @initializers
