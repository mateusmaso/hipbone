module.exports = ->
  describe "parse body", ->
    it "should parse view element", ->
      $("#fixtures").append("<hb-view id='test'></hb-view>")
      app = new Hipbone.Application
      app.run()
      chai.should($("#fixtures").find("#test")[0].hipboneView).exist
