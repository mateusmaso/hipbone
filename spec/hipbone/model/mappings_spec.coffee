module.exports = ->
  describe "mappings", ->
    # describe "model", ->
    #   it "should be null by default", ->
    #     page = new App.Page
    #     chai.should(page.get("book")).not.exist
    #   it "should map for id", ->
    #     book = new App.Book(id: 1)
    #     page = new App.Page(book_id: 1)
    #     chai.expect(page.get("book")).to.equal(book)
    #   it "should map for transient", ->
    #     book = new App.Book
    #     page = new App.Page(book: book)
    #     chai.expect(page.get("book")).to.equal(book)
    #   it "should parse object", ->
    #     page = new App.Page(book: id: 1)
    #     chai.expect(page.get("book").id).to.equal(1)
    #
    # describe "polymorphic", ->
    #   it "should be null by default", ->
    #     page = new App.Page
    #     chai.should(page.get("top_annotation_id")).not.exist
    #   it "should map for id and type", ->
    #     annotation = new App.ReaderAnnotation(id: 1)
    #     page = new App.Page(top_annotation_id: 1, top_annotation_type: "ReaderAnnotation")
    #     chai.expect(page.get("top_annotation")).to.equal(annotation)
    #   it "should map for transient", ->
    #     annotation = new App.ReaderAnnotation(id: 1)
    #     page = new App.Page(top_annotation: annotation)
    #     chai.expect(page.get("top_annotation")).to.equal(annotation)
    #   it "should parse object", ->
    #     page = new App.Page(top_annotation: {id: 1, type: "ReaderAnnotation"})
    #     chai.expect(page.get("top_annotation").id).to.equal(1)
    #
    # describe "collection", ->
    #   it "should be a collection by default", ->
    #     book = new App.Book
    #     chai.expect(book.get("pages")).to.be.a.collection
    #   it "should map", ->
    #     book = new App.Book
    #     chai.expect(book.get("pages").parent).to.be.equal(book)
    #   it "should parse array", ->
    #     book = new App.Book(pages: [{id: 1}])
    #     chai.expect(book.get("pages").first().id).to.be.equal(1)
    #   it "should parse {models: [], meta: {}}", ->
    #     book = new App.Book(pages: {models: [{id: 1}]})
    #     chai.expect(book.get("pages").first().id).to.be.equal(1)
