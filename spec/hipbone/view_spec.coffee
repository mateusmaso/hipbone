module.exports = ->
  describe "View", ->
    require("./view/store_spec").apply(this)
    require("./view/bubble_spec").apply(this)
    require("./view/content_spec").apply(this)
    require("./view/context_spec").apply(this)
    require("./view/populate_spec").apply(this)
    require("./view/elements_spec").apply(this)
    require("./view/template_spec").apply(this)
    require("./view/lifecycle_spec").apply(this)
    require("./view/properties_spec").apply(this)
    require("./view/class_name_bindings_spec").apply(this)
