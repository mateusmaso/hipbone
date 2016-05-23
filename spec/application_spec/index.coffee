module.exports = ->
  describe "Application", ->
    require("./ajax_spec").apply(this)
    require("./state_spec").apply(this)
    require("./locale_spec").apply(this)
    require("./initializers_spec").apply(this)
