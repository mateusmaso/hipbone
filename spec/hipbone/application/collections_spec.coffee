module.exports = ->
  describe "collections", ->
    it "should store collections inside app scope as default", ->
      class App extends Hipbone.Application
      class App.Collection extends Hipbone.Collection
      app = new App
      chai.expect(app.collections.Collection).to.be.equal(App.Collection)

    it "should store specified collections", ->
      class Collection extends Hipbone.Collection
      app = new Hipbone.Application(collections: Collection: Collection)
      chai.expect(app.collections.Collection).to.be.deep.equal(Collection)
