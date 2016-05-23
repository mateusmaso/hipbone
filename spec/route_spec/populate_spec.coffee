module.exports = ->
  describe "populate", ->
    it "should populate", ->
      deferred = $.Deferred()
      class Route extends Hipbone.Route
        populate: -> deferred.resolve()
      route = new Route
      route.prepare()
      chai.expect(deferred).to.be.fulfilled

    it "should not populate", ->
      deferred = $.Deferred()
      class Route extends Hipbone.Route
        populated: -> true
        populate: -> deferred.resolve()
      route = new Route
      route.prepare()
      chai.expect(deferred).to.not.be.fulfilled
