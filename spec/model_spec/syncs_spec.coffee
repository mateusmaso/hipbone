module.exports = ->
  describe "syncs", ->
    it "should set synced and trigger", ->
      synced = null
      model = new Hipbone.Model
      model.on "synced", -> synced = @synced
      model.didSync()
      chai.expect(synced).to.be.equal(model.synced)

    it "should set synced name and trigger", ->
      synced = previewSynced = null
      model = new Hipbone.Model
      model.on "synced:preview", -> previewSynced = @syncs.preview
      model.on "synced", -> synced = @synced
      model.didSync("preview")
      chai.expect([synced, previewSynced]).to.be.deep.equal([null, model.syncs.preview])

    it "should unset synced and trigger", ->
      synced = 123
      model = new Hipbone.Model
      model.on "unsync", -> synced = @synced
      model.unsync()
      chai.expect(synced).to.be.equal(undefined)

    it "should unset synced name and trigger", ->
      synced = previewSynced = 123
      model = new Hipbone.Model
      model.on "unsync:preview", -> previewSynced = @syncs.preview
      model.on "unsync", -> synced = @synced
      model.unsync("preview")
      chai.expect([synced, previewSynced]).to.be.deep.equal([123, undefined])
