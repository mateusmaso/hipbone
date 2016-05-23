module.exports = ->
  describe "populate", ->
    it "should populate", ->
      deferred = $.Deferred()
      class Collection extends Hipbone.Collection
        populate: -> deferred.resolve()
      collection = new Collection
      collection.prepare()
      chai.expect(deferred).to.be.fulfilled

    it "should not populate", ->
      deferred = $.Deferred()
      class Collection extends Hipbone.Collection
        populate: -> deferred.resolve()
      collection = new Collection
      collection.didSync()
      collection.prepare()
      chai.expect(deferred).to.not.be.fulfilled
