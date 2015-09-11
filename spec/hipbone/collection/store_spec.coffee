module.exports = ->
  describe "store", ->
    it "should be equal with parent", ->
      model = new Hipbone.Model
      collection = new Hipbone.Collection([], parent: model)
      chai.expect(collection).to.be.equal(new Hipbone.Collection([], parent: model))

    it "should be different without parent", ->
      collection = new Hipbone.Collection([])
      chai.expect(collection).to.not.be.equal(new Hipbone.Collection([]))
