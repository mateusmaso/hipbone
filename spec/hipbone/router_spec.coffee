module.exports = ->
  describe "Router", ->
    require("./router/url_spec").apply(this)
    require("./router/matches_spec").apply(this)
