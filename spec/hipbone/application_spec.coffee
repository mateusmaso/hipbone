module.exports = ->
  describe "Application", ->
    require("./application/ajax_spec").apply(this)
    require("./application/models_spec").apply(this)
    require("./application/routes_spec").apply(this)
    require("./application/views_spec").apply(this)
    require("./application/templates_spec").apply(this)
    require("./application/collections_spec").apply(this)
    require("./application/state_spec").apply(this)
    require("./application/locales_spec").apply(this)
    require("./application/initializers_spec").apply(this)
