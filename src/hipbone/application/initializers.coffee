module.exports =

  initializers: [
    require("./initializers/sync"),
    require("./initializers/register_modules"),
    require("./initializers/register_elements"),
    require("./initializers/register_helpers"),
    require("./initializers/parse_body"),
    require("./initializers/parse_model"),
    require("./initializers/link_bridge"),
    require("./initializers/prevent_form"),
    require("./initializers/start_history")
  ]

  initializeInitializers: (initializers=[]) ->
    @initializers.push(initializer) for initializer in initializers

  runInitializers: (options) ->
    initializer.apply(this, [options]) for initializer in @initializers
