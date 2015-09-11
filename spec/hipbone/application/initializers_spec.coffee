module.exports = ->
  describe "initializers", ->
    require("./initializers/sync_spec").apply(this)
    require("./initializers/register_modules_spec").apply(this)
    require("./initializers/register_elements_spec").apply(this)
    require("./initializers/register_helpers_spec").apply(this)
    require("./initializers/parse_body_spec").apply(this)
    require("./initializers/parse_model_spec").apply(this)
    require("./initializers/link_bridge_spec").apply(this)
    require("./initializers/prevent_form_spec").apply(this)
    require("./initializers/start_history_spec").apply(this)
