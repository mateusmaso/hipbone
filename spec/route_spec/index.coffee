module.exports = ->
  describe "Route", ->
    require("./title_spec").apply(this)
    require("./store_spec").apply(this)
    require("./element_spec").apply(this)
    require("./populate_spec").apply(this)
    require("./parameters_spec").apply(this)
