module.exports = ->
  describe "pagination", ->
    # before ->
    #   @readerAnnotations = new App.ReaderAnnotations
    #
    # it "should increment pagination", ->
    #   @readerAnnotations.incrementPagination()
    #   chai.expect(@readerAnnotations.url(paginate: true)).to.be.equal("/annotations?reader=true&limit=10&offset=10")
    #
    # it "should decrement pagination", ->
    #   @readerAnnotations.decrementPagination()
    #   chai.expect(@readerAnnotations.url(paginate: true)).to.be.equal("/annotations?reader=true&limit=10&offset=0")
    #
    # it "should fetch only models since beginning", ->
    #   @readerAnnotations.incrementPagination()
    #   @readerAnnotations.incrementPagination()
    #   chai.expect(@readerAnnotations.url()).to.be.equal("/annotations?reader=true&limit=30&offset=0")
