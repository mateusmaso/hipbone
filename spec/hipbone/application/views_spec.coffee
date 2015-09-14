module.exports = ->
  describe "views", ->
    it "should store views inside app scope as default", ->
      class App extends Hipbone.Application
      class App.View extends Hipbone.View
      app = new App
      chai.expect(app.views.View).to.be.equal(App.View)

    it "should store specified views", ->
      class View extends Hipbone.View
      app = new Hipbone.Application(views: View: View)
      chai.expect(app.views.View).to.be.deep.equal(View)
