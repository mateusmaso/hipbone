module.exports = ->
  describe "meta", ->
    it "should initialize meta and defaults", ->
      collection = new Hipbone.Collection([], defaults: {max: 50}, meta: {count: 10})
      chai.expect([collection.meta.get("count"), collection.meta.get("max")]).to.be.deep.equal([10, 50])

    it "should listen to events", ->
      changed = false
      collection = new Hipbone.Collection
      collection.on "meta:change", => changed = true
      collection.meta.set(hello: "world")
      chai.expect(changed).to.be.true
