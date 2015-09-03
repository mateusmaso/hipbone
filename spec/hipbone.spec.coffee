if navigator.userAgent.indexOf('PhantomJS') < 0
  chai.Assertion.addProperty 'model', -> @_obj instanceof Hipbone.Model
  chai.Assertion.addProperty 'collection', -> @_obj instanceof Hipbone.Collection

  describe "hipbone", ->
    before ->
      window.App = @App = App = class App extends Hipbone.Application

      class App.Book extends Hipbone.Model
        mappings:
          pages: "Pages"

      class App.Page extends Hipbone.Model
        mappings:
          book: "Book"
          annotations: "Annotations"

        polymorphics: ["top_annotation"]

      class App.Pages extends Hipbone.Collection
        model: App.Page

      class App.ReaderAnnotation extends Hipbone.Model

      class App.AuthorAnnotation extends Hipbone.Model

      class App.Annotations extends Hipbone.Collection

      @app = new App
      @app.run()

    describe "Model", ->
      before ->
        @model = new Hipbone.Model

      describe "identity map", ->
        it "should be equal", ->
          modelWithId = new Hipbone.Model(id: 1)
          chai.expect(modelWithId).to.equal(new Hipbone.Model(id: 1))

        it "should be diff", ->
          modelWithoutId = new Hipbone.Model
          chai.expect(modelWithoutId).to.not.equal(new Hipbone.Model)

      describe "mappings", ->
        describe "model", ->
          it "should be null by default", ->
            page = new @App.Page
            chai.should(page.get("book")).not.exist
          it "should map for id", ->
            book = new @App.Book(id: 1)
            page = new @App.Page(book_id: 1)
            chai.expect(page.get("book")).to.equal(book)
          it "should map for transient", ->
            book = new @App.Book
            page = new @App.Page(book: book)
            chai.expect(page.get("book")).to.equal(book)
          it "should parse object", ->
            page = new @App.Page(book: id: 1)
            chai.expect(page.get("book").id).to.equal(1)

        describe "polymorphic", ->
          it "should be null by default", ->
            page = new @App.Page
            chai.should(page.get("top_annotation_id")).not.exist
          it "should map for id and type", ->
            annotation = new @App.ReaderAnnotation(id: 1)
            page = new @App.Page(top_annotation_id: 1, top_annotation_type: "ReaderAnnotation")
            chai.expect(page.get("top_annotation")).to.equal(annotation)
          it "should map for transient", ->
            annotation = new @App.ReaderAnnotation(id: 1)
            page = new @App.Page(top_annotation: annotation)
            chai.expect(page.get("top_annotation")).to.equal(annotation)
          it "should parse object", ->
            page = new @App.Page(top_annotation: {id: 1, type: "ReaderAnnotation"})
            chai.expect(page.get("top_annotation").id).to.equal(1)

        describe "collection", ->
          it "should be a collection by default", ->
            book = new @App.Book
            chai.expect(book.get("pages")).to.be.a.collection
          it "should map", ->
            book = new @App.Book
            chai.expect(book.get("pages").parent).to.be.equal(book)
          it "should parse array", ->
            book = new @App.Book(pages: [{id: 1}])
            chai.expect(book.get("pages").first().id).to.be.equal(1)
          it "should parse {models: [], meta: {}}", ->
            book = new @App.Book(pages: {models: [{id: 1}]})
            chai.expect(book.get("pages").first().id).to.be.equal(1)

      describe "validation", ->
        it "to-do", ->

      describe "computed attributes", ->
        it "to-do", ->
