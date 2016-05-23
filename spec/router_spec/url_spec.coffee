module.exports = ->
  describe "url", ->
    before ->
      @app = new Hipbone.Application
      @app.run()

    it "should parse fragment with params", ->
      chai.expect(@app.router.url("/some/url", foo: "bar")).to.be.equal("/some/url?foo=bar")

    it "should parse fragment and merge params", ->
      chai.expect(@app.router.url("/some/url?bar=foo", foo: "bar")).to.be.equal("/some/url?bar=foo&foo=bar")
