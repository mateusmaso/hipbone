module.exports = ->
  describe "matches", ->
    before ->
      @app = new Hipbone.Application
      @app.run()
      @app.router.match("/test-*foo", route: Hipbone.Route, name: "test", url: "/test-:foo")

    it "should get match route url with params", ->
      chai.expect(@app.router.matchUrl("test", foo: "bar", test: "ok")).to.be.equal("/test-bar?test=ok")

    it "should trigger match route with params", ->
      class BookRoute extends Hipbone.Route
        element: ->
          $("<div>")[0]
        @register "BookRoute"

      @app.router.match "books/:id", route: BookRoute, name: "book", url: "books/:id"
      @app.router.history.loadUrl("/books/1")
      route = @app.router._route
      chai.expect([route instanceof BookRoute, route.get("id")]).to.be.deep.equal([true, 1])
