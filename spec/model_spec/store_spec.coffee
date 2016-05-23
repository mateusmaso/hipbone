module.exports = ->
  describe "store", ->
    it "should be equal with id", ->
      model = new Hipbone.Model(id: 1)
      chai.expect(model).to.be.equal(new Hipbone.Model(id: 1))

    it "should be different without id", ->
      model = new Hipbone.Model
      chai.expect(model).to.not.equal(new Hipbone.Model)
