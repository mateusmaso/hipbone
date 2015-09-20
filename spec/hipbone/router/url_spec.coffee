module.exports = ->
  describe "url", ->
    before ->
      @app = new Hipbone.Application
      @app.run()
      @app.router.match("test", route: Hipbone.Route, url: "/test-*foo", toURL: (params={}) -> "/test-#{params.foo}")

    it "should get route url", ->
      chai.expect(@app.router.url("test", foo: "bar")).to.be.equal("/test-bar")

    it "should parse fragment with params", ->
      chai.expect(@app.router.urlFragment("/some/url", foo: "bar")).to.be.equal("/some/url?foo=bar")

    it "should parse route fragment with params", ->
      chai.expect(@app.router.urlFragment("test", foo: "bar")).to.be.equal("/test-bar?foo=bar")
