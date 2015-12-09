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
