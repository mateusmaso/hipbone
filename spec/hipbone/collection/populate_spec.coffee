module.exports = ->
  describe "populate", ->
    it "should populate", ->
      collection = new Hipbone.Collection
      collection.urlRoot = "/populate"
      chai.expect(collection.prepare().state()).to.be.equal("rejected")

    it "should not populate", ->
      collection = new Hipbone.Collection
      collection.didSync()
      chai.expect(collection.prepare().state()).to.be.equal("resolved")
