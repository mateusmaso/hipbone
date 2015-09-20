module.exports = ->
  describe "Application", ->
    require("./application/ajax_spec").apply(this)
    require("./application/state_spec").apply(this)
    require("./application/locale_spec").apply(this)
    require("./application/initializers_spec").apply(this)
