module.exports = ->
  describe "polymorphic", ->
    class ReaderAnnotation extends Hipbone.Model
    class AuthorAnnotation extends Hipbone.Model
    class Annotations extends Hipbone.Collection
      model: [ReaderAnnotation, AuthorAnnotation]

    before ->
      @app = new Hipbone.Application(models: {ReaderAnnotation: ReaderAnnotation, AuthorAnnotation: AuthorAnnotation}, collections: {Annotations: Annotations})

    it "should set model", ->
      annotation1 = new AuthorAnnotation(id: 1)
      annotation2 = new ReaderAnnotation(id: 1)
      annotations = new Annotations([annotation1, annotation2])
      chai.expect(annotations.map (annotation) -> annotation.id).to.be.deep.equal([1, 1])

    it "should set object", ->
      annotation1 = id: 1, type: "AuthorAnnotation"
      annotation2 = id: 1, type: "ReaderAnnotation"
      annotations = new Annotations([annotation1, annotation2])
      chai.expect(annotations.map (annotation) -> annotation.id).to.be.deep.equal([1, 1])
