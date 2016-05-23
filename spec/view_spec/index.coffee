module.exports = ->
  describe "View", ->
    require("./bubble_spec").apply(this)
    require("./content_spec").apply(this)
    require("./context_spec").apply(this)
    require("./populate_spec").apply(this)
    require("./elements_spec").apply(this)
    require("./template_spec").apply(this)
    require("./lifecycle_spec").apply(this)
    require("./properties_spec").apply(this)
    require("./class_name_bindings_spec").apply(this)
