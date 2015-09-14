module.exports = ->
  describe "models", ->
    it "should store models inside app scope as default", ->
      class App extends Hipbone.Application
      class App.Model extends Hipbone.Model
      app = new App
      chai.expect(app.models.Model).to.be.equal(App.Model)

    it "should store specified models", ->
      class Model extends Hipbone.Model
      app = new Hipbone.Application(models: Model: Model)
      chai.expect(app.models.Model).to.be.deep.equal(Model)
