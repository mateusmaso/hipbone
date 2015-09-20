module.exports = ->
  describe "matches", ->
    before ->
      @app = new Hipbone.Application
      @app.run()

    it "should trigger matched route with params", ->
      class BookRoute extends Hipbone.Route
        element: ->
          $("<div>")[0]
        @register "BookRoute"

      @app.router.match "book", route: BookRoute, url: "books/:id", toURL: (params={}) -> "books/#{params.id}"
      @app.router.history.loadUrl("/books/1")
      route = @app.router._route
      chai.expect([route instanceof BookRoute, route.get("id")]).to.be.deep.equal([true, 1])
