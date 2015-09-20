module.exports = ->
  describe "parameters", ->
    it "should initialize state and defaults", ->
      class Route extends Hipbone.Route
        defaults:
          bar: 2
      route = new Route(foo: 1)
      chai.expect([route.params.get("foo"), route.params.get("bar")]).to.be.deep.equal([1, 2])

    it "should get/set", ->
      route = new Hipbone.Route
      route.set(foo: 123)
      route.set("bar", 321)
      chai.expect([route.get("foo"), route.get("bar")]).to.be.deep.equal([123, 321])

    it "should listen to events", ->
      changed = false
      route = new Hipbone.Route
      route.on "change", => changed = true
      route.set(hello: "world")
      chai.expect(changed).to.be.true

    it "should parse", ->
      class Route extends Hipbone.Route
        parse: (response={}) ->
          response.id = "_id#{response.id}" if response.id
          response
      route = new Route(id: 123)
      chai.expect(route.get("id")).to.be.deep.equal("_id123")
