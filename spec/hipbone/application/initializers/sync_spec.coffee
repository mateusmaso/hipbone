module.exports = ->
  describe "sync", ->
    it "should extend ajax settings", ->
      model = new Hipbone.Model(id: 1)
      model.urlRoot = "/model"
      settings = Backbone.sync("read", model).settings
      chai.expect([settings.url, settings.sync]).to.be.deep.equal(["/api/v1/model/1", true])
