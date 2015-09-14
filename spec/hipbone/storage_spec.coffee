module.exports = ->
  describe "Storage", ->
    storage = new Hipbone.Storage

    it "should get/set", ->
      object = foo: bar: 123
      storage.set("object", object)
      chai.expect(storage.get("object")).to.be.deep.equal(object)

    it "should unset", ->
      storage.unset("object")
      chai.should(storage.get("object")).not.exist

    it "should match", ->
      storage.set("model123", {id: 1})
      storage.set("view123", {id: 2})
      storage.set("collection123", {id: 3})
      chai.expect(storage.match(/model/)).to.be.deep.equal({"model123": {id: 1}})

    it "should clear", ->
      regex = new RegExp(storage.prefix)
      storage.clear()
      chai.expect(_.keys(storage.match(regex)).length).to.be.equal(0)
