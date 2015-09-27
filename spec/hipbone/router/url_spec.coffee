module.exports = ->
  describe "url", ->
    before ->
      @app = new Hipbone.Application
      @app.run()

    it "should parse fragment with params", ->
      chai.expect(@app.router.url("/some/url", foo: "bar")).to.be.equal("/some/url?foo=bar")
