module.exports = ->
  describe "title", ->
    it "should set root title", ->
      route = new Hipbone.Route({}, titleRoot: "Test")
      chai.expect(route.title()).to.be.equal("Test")

    it "should work with subtitle", ->
      class Route extends Hipbone.Route
        subtitle: -> "Foo"
      route = new Route({}, titleRoot: "Bar")
      chai.expect(route.title()).to.be.equal("Foo - Bar")
