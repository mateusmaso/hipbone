module.exports = ->
  describe "sync", ->
    it "should set synced and trigger", ->
      synced = null
      collection = new Hipbone.Collection
      collection.on "synced", -> synced = @synced
      collection.didSync()
      chai.expect(synced).to.be.equal(collection.synced)

    it "should unset synced and trigger", ->
      synced = 123
      collection = new Hipbone.Collection
      collection.on "unsync", -> synced = @synced
      collection.unsync()
      chai.expect(synced).to.be.equal(undefined)
