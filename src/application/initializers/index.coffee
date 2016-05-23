module.exports =

  initializeInitializers: ->
    @initializers ||= []
    @initializers.unshift(require("./parse_body"))
    @initializers.unshift(require("./parse_model"))
    @initializers.unshift(require("./link_bridge"))
    @initializers.unshift(require("./prevent_form"))
    @initializers.unshift(require("./prepare_sync"))
    @initializers.unshift(require("./register_helpers"))

  runInitializers: (options) ->
    initializer.apply(this, [options]) for initializer in @initializers
