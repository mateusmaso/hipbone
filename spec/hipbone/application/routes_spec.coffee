module.exports = ->
  describe "routes", ->
    it "should store routes inside app scope as default", ->
      class App extends Hipbone.Application
      class App.Route extends Hipbone.Route
      app = new App
      chai.expect(app.routes.Route).to.be.equal(App.Route)

    it "should store specified routes", ->
      class Route extends Hipbone.Route
      app = new Hipbone.Application(routes: Route: Route)
      chai.expect(app.routes.Route).to.be.deep.equal(Route)
