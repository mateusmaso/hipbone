module.exports = ->
  describe "collections", ->
    it "should contain defined", ->
      chai.expect(@app.collections.Books).to.be.equal(App.Books)
