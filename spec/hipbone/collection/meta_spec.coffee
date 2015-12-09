module.exports = ->
  describe "meta", ->
    before ->
      @collection = new Hipbone.Collection

    it "should initialize meta and defaults", ->
      class Collection extends Hipbone.Collection
        defaults:
          max: 50
      collection = new Collection(meta: count: 10)
      chai.expect([collection.meta.get("count"), collection.meta.get("max")]).to.be.deep.equal([10, 50])

    it "should listen to events", ->
      changed = false
      collection = new Hipbone.Collection
      collection.on "meta:change", => changed = true
      collection.meta.set(hello: "world")
      chai.expect(changed).to.be.true

    it "should not increment/decrement counter when parse", ->
      @collection.meta.set(count: 2)
      @collection.set([{id: 3}, {id: 4}], parse: true)
      chai.expect(@collection.meta.get("count")).to.be.equal(2)

    it "should increment counter on add", ->
      @collection.add(id: 5)
      chai.expect(@collection.meta.get("count")).to.be.equal(3)

    it "should decrement counter on remove", ->
      @collection.pop()
      chai.expect(@collection.meta.get("count")).to.be.equal(2)
