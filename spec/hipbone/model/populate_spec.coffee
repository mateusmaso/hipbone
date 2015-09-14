module.exports = ->
  describe "populate", ->
    it "should populate", ->
      model = new Hipbone.Model
      model.urlRoot = "/populate"
      chai.expect(model.prepare().state()).to.be.equal("rejected")

    it "should not populate", ->
      model = new Hipbone.Model
      model.didSync()
      chai.expect(model.prepare().state()).to.be.equal("resolved")
