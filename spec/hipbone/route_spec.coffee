module.exports = ->
  describe "Route", ->
    require("./route/title_spec").apply(this)
    require("./route/store_spec").apply(this)
    require("./route/element_spec").apply(this)
    require("./route/populate_spec").apply(this)
    require("./route/parameters_spec").apply(this)
