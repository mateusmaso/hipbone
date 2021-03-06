module.exports = ->
  describe "store", ->
    it "should be equal with same path and popstate", ->
      route = new Hipbone.Route({}, pathname: "/test")
      chai.expect(route).to.be.equal(new Hipbone.Route({}, pathname: "/test", popstate: true))

    it "should be different with same path and no popstate", ->
      route = new Hipbone.Route({}, pathname: "/test2")
      chai.expect(route).to.not.equal(new Hipbone.Route({}, pathname: "/test2", popstate: false))
