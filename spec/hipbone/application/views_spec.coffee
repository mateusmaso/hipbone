module.exports = ->
  describe "views", ->
    it "should contain defined", ->
      chai.expect(@app.views.BooView).to.be.equal(App.BooView)
