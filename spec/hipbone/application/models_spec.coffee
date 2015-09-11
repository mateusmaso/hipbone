module.exports = ->
  describe "models", ->
    it "should contain defined", ->
      chai.expect(@app.models.Book).to.be.equal(App.Book)
