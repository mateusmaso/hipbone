module.exports = ->
  describe "nested attributes", ->
    it "should get/set", ->
      model = new Hipbone.Model(foo: bar: 123)
      model.set("foo.bar", 321)
      chai.expect(model.get("foo.bar")).to.be.deep.equal(321)

    it "should listen to changes", ->
      changes = 0
      model = new Hipbone.Model(foo: bar: 123)
      model.on "change", => changes++
      model.on "change:foo", => changes++
      model.on "change:foo.bar", => changes++
      model.set("foo.bar", 321)
      chai.expect(changes).to.be.equal(3)
