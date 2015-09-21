module.exports = ->
  describe "pagination", ->
    before ->
      class Collection extends Hipbone.Collection
        urlRoot: "/models"
        pagination:
          offset: 0
          limit: 10
      @collection = new Collection

    it "should increment pagination", ->
      @collection.incrementPagination()
      chai.expect(@collection.url(paginate: true)).to.be.equal("/models?limit=10&offset=10")

    it "should decrement pagination", ->
      @collection.decrementPagination()
      chai.expect(@collection.url(paginate: true)).to.be.equal("/models?limit=10&offset=0")

    it "should fetch only models since beginning", ->
      @collection.incrementPagination()
      @collection.incrementPagination()
      chai.expect(@collection.url()).to.be.equal("/models?limit=30&offset=0")

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
