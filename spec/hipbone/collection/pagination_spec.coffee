module.exports = ->
  describe "pagination", ->
    class ReaderAnnotation extends Hipbone.Model
    class ReaderAnnotations extends Hipbone.Collection
      urlRoot: "/annotations"
      pagination:
        offset: 0
        limit: 10

    before ->
      @readerAnnotations = new ReaderAnnotations

    it "should increment pagination", ->
      @readerAnnotations.incrementPagination()
      chai.expect(@readerAnnotations.url(paginate: true)).to.be.equal("/annotations?limit=10&offset=10")

    it "should decrement pagination", ->
      @readerAnnotations.decrementPagination()
      chai.expect(@readerAnnotations.url(paginate: true)).to.be.equal("/annotations?limit=10&offset=0")

    it "should fetch only models since beginning", ->
      @readerAnnotations.incrementPagination()
      @readerAnnotations.incrementPagination()
      chai.expect(@readerAnnotations.url()).to.be.equal("/annotations?limit=30&offset=0")
