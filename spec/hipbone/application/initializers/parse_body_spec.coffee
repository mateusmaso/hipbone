module.exports = ->
  describe "parse body", ->
    it "should parse view elements", ->
      $("#fixtures").append("<hb-view id='test'></hb-view>")
      app = new Hipbone.Application
      chai.should($("#fixtures").find("#test")[0].hipboneView).exist
