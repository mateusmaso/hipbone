module.exports = ->
  describe "filters", ->
    class ReaderAnnotation extends Hipbone.Model
    class ReaderAnnotations extends Hipbone.Collection
      model: ReaderAnnotation
      urlRoot: "/annotations"
      filters:
        reader: true

    it "should be in query url params", ->
      readerAnnotations = new ReaderAnnotations
      chai.expect(readerAnnotations.url()).to.be.equal("/annotations?reader=true")
