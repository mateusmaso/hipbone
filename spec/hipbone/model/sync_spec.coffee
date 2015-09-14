module.exports = ->
  describe "sync", ->
    it "should set synced and trigger", ->
      synced = null
      model = new Hipbone.Model
      model.on "synced", -> synced = @synced
      model.didSync()
      chai.expect(synced).to.be.equal(model.synced)

    it "should unset synced and trigger", ->
      synced = 123
      model = new Hipbone.Model
      model.on "unsync", -> synced = @synced
      model.unsync()
      chai.expect(synced).to.be.equal(undefined)
