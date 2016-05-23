module.exports = ->
  describe "properties", ->
    it "should initialize properties, internals and defaults", ->
      class View extends Hipbone.View
         internals: ["fooBar"]
         defaults:
           bar: 2
      view = new View(foo: 1, fooBar: 1)
      chai.expect([view.props.get("foo"), view.props.get("bar"), view.props.get("fooBar")]).to.be.deep.equal([1, 2, undefined])

    it "should get/set props", ->
      view = new Hipbone.View
      view.set(foo: 123)
      view.set("bar", 321)
      chai.expect([view.get("foo"), view.get("bar")]).to.be.deep.equal([123, 321])

    it "should listen to events", ->
      changed = false
      view = new Hipbone.View
      view.on "change", => changed = true
      view.set(hello: "world")
      chai.expect(changed).to.be.true
