module.exports = ->
  describe "start history", ->
    it "should start history", ->
      app = new Hipbone.Application
      app.run()
      chai.expect(Backbone.History.started).to.be.true
