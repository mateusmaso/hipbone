module.exports = ->
  describe "store", ->
    it "should be different", ->
      view = new Hipbone.View
      chai.expect(view).to.not.be.equal(new Hipbone.View)
