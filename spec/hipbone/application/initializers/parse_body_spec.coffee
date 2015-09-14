module.exports = ->
  describe "parse body", ->
    it "should parse view elements", ->
      $("#fixtures").append("<hb-other></hb-other>")
      initialized = false
      class OtherView extends Hipbone.View
        initialize: -> initialized = true
      app = new Hipbone.Application(views: OtherView: OtherView)
      app.run()
      chai.expect(initialized).to.be.true

    it "should detect application view", ->
      $("#fixtures").append("<hb-application></hb-application>")
      appView = null
      class ApplicationView extends Hipbone.View
        initialize: -> appView = this
      app = new Hipbone.Application(views: ApplicationView: ApplicationView)
      app.run()
      chai.expect(app.appView).to.be.equal(appView)
