module.exports = ->
  describe "polymorphic", ->
    class ReaderAnnotation extends Hipbone.Model
      @register "ReaderAnnotation"
    class AuthorAnnotation extends Hipbone.Model
      @register "AuthorAnnotation"
    class Annotations extends Hipbone.Collection
      model: [ReaderAnnotation, AuthorAnnotation]
      @register "Annotations"

    describe "model", ->
      it "should initialize", ->
        annotation1 = new AuthorAnnotation(id: 1)
        annotation2 = new AuthorAnnotation(id: 2)
        annotation3 = new ReaderAnnotation(id: 3)
        annotation4 = new ReaderAnnotation(id: 4)
        annotations = new Annotations([annotation1, annotation2, annotation3, annotation4])
        chai.expect(annotations.map (annotation) -> annotation.id).to.be.deep.equal([1, 2, 3, 4])

      it "should set", ->
        annotation1 = new AuthorAnnotation(id: 5)
        annotation2 = new AuthorAnnotation(id: 6)
        annotations = new Annotations()
        annotations.set([annotation1, annotation2])
        chai.expect(annotations.map (annotation) -> annotation.id).to.be.deep.equal([5, 6])

    describe "object", ->
      it "should initialize", ->
        annotation1 = id: 1, type: "AuthorAnnotation"
        annotation2 = id: 2, type: "AuthorAnnotation"
        annotation3 = id: 3, type: "ReaderAnnotation"
        annotation4 = id: 4, type: "ReaderAnnotation"
        annotations = new Annotations([annotation1, annotation2, annotation3, annotation4])
        chai.expect(annotations.map (annotation) -> annotation.id).to.be.deep.equal([1, 2, 3, 4])

      it "should set", ->
        annotation1 = id: 5, type: "AuthorAnnotation"
        annotation2 = id: 6, type: "ReaderAnnotation"
        annotations = new Annotations()
        annotations.set([annotation1, annotation2])
        chai.expect(annotations.map (annotation) -> annotation.id).to.be.deep.equal([5, 6])
