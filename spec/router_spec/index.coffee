module.exports = ->
  describe "Router", ->
    require("./url_spec").apply(this)
    require("./matches_spec").apply(this)
