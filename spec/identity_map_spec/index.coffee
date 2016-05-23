module.exports = ->
  describe "Identity Map", ->
    identityMap = new Hipbone.IdentityMap

    it "should store/find", ->
      identityMap.store("foo", "bar")
      chai.expect(identityMap.find("foo")).to.be.equal("bar")

    it "should store/find all", ->
      identityMap.storeAll(["foo", "bar"], "bar")
      chai.expect(identityMap.findAll(["foo", "bar"])).to.be.deep.equal(["bar", "bar"])

    it "should match", ->
      identityMap.storeAll(["model123", "view123", "collection123"], "test")
      chai.expect(identityMap.match(/view/)).to.be.deep.equal({"view123": "test"})

    it "should delete", ->
      identityMap.delete("foo")
      chai.should(identityMap.find("foo")).not.exist

    it "should delete all", ->
      identityMap.deleteAll(["foo", "bar"])
      chai.should(identityMap.find("foo")).not.exist

    it "should clear", ->
      identityMap.clear()
      chai.expect(_.keys(identityMap.instances).length).to.be.equal(0)
