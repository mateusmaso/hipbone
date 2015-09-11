module.exports = ->
  describe "routes", ->
    it "should contain defined", ->
      chai.expect(@app.routes.BookRoute).to.be.equal(App.BookRoute)
