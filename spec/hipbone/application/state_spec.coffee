module.exports = ->
  describe "state", ->
    it "should initialize state and defaults", ->
      app = new Hipbone.Application(defaults: {bar: 2}, state: {foo: 1})
      chai.expect([app.state.get("foo"), app.state.get("bar")]).to.be.deep.equal([1, 2])

    it "should get/set", ->
      app = new Hipbone.Application
      app.set(foo: 123)
      app.set("bar", 321)
      chai.expect([app.get("foo"), app.get("bar")]).to.be.deep.equal([123, 321])

    it "should listen to events", ->
      changed = false
      app = new Hipbone.Application
      app.on "change", => changed = true
      app.set(hello: "world")
      chai.expect(changed).to.be.true
