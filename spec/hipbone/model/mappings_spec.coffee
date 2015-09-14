module.exports = ->
  describe "mappings", ->
    class Book extends Hipbone.Model
      mappings:
        pages: "Pages"

    class Page extends Hipbone.Model
      mappings:
        book: "Book"
        top_annotation: ["ReaderAnnotation"]

    class Pages extends Hipbone.Collection
      model: Page

    class ReaderAnnotation extends Hipbone.Model

    describe "model", ->
      before ->
        @app = new Hipbone.Application(models: {Book: Book, Page: Page, ReaderAnnotation: ReaderAnnotation}, collections: {Pages: Pages})

      it "should be null by default", ->
        page = new Page
        chai.should(page.get("book")).not.exist
      it "should map for id", ->
        book = new Book(id: 1)
        page = new Page(book_id: 1)
        chai.expect(page.get("book")).to.equal(book)
      it "should map for transient", ->
        book = new Book
        page = new Page(book: book)
        chai.expect(page.get("book")).to.equal(book)
      it "should parse object", ->
        page = new Page(book: id: 1)
        chai.expect(page.get("book").id).to.equal(1)

    describe "polymorphic", ->
      it "should be null by default", ->
        page = new Page
        chai.should(page.get("top_annotation_id")).not.exist
      it "should map for id and type", ->
        annotation = new ReaderAnnotation(id: 1)
        page = new Page(top_annotation_id: 1, top_annotation_type: "ReaderAnnotation")
        chai.expect(page.get("top_annotation")).to.equal(annotation)
      it "should map for transient", ->
        annotation = new ReaderAnnotation(id: 1)
        page = new Page(top_annotation: annotation)
        chai.expect(page.get("top_annotation")).to.equal(annotation)
      it "should parse object", ->
        page = new Page(top_annotation: {id: 1, type: "ReaderAnnotation"})
        chai.expect(page.get("top_annotation").id).to.equal(1)

    describe "collection", ->
      it "should be a collection by default", ->
        book = new Book
        chai.expect(book.get("pages")).to.be.a.collection
      it "should map", ->
        book = new Book
        chai.expect(book.get("pages").parent).to.be.equal(book)
      it "should parse array", ->
        book = new Book(pages: [{id: 1}])
        chai.expect(book.get("pages").first().id).to.be.equal(1)
      it "should parse {models: [], meta: {}}", ->
        book = new Book(pages: {models: [{id: 1}]})
        chai.expect(book.get("pages").first().id).to.be.equal(1)
