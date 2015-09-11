module.exports = ->
  describe "Route", ->
    require("./route/url_spec").apply(this)
    require("./route/view_spec").apply(this)
    require("./route/title_spec").apply(this)
    require("./route/store_spec").apply(this)
    require("./route/active_spec").apply(this)
    require("./route/populate_spec").apply(this)
    require("./route/parameters_spec").apply(this)
