if navigator.userAgent.indexOf('PhantomJS') < 0
  chai.Assertion.addProperty 'model', -> @_obj instanceof Hipbone.Model
  chai.Assertion.addProperty 'collection', -> @_obj instanceof Hipbone.Collection

  describe "hipbone", ->
    before ->
      window.App = @App = App = class App extends Hipbone.Application
      class App.Book extends Hipbone.Model
      class App.Page extends Hipbone.Model
      class App.ReaderAnnotation extends Hipbone.Model
      class App.AuthorAnnotation extends Hipbone.Model
      class App.Annotations extends Hipbone.Collection
      class App.Pages extends Hipbone.Collection

      @app = new App
      @app.run()

    describe "Model", ->
      describe "identity map", ->
        it "should be equal with id", ->
          model = new Hipbone.Model(id: 1)
          chai.expect(model).to.equal(new Hipbone.Model(id: 1))

        it "should be different without id", ->
          model = new Hipbone.Model
          chai.expect(model).to.not.equal(new Hipbone.Model)

      describe "mappings", ->
        before ->
          @App.Book::mappings = pages: "Pages"
          @App.Page::mappings = book: "Book"
          @App.Page::polymorphics = ["top_annotation"]
          @App.Pages::model = App.Page

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

      describe "validations", ->
        before ->
          @App.Page::validations = text: (text) -> not _.string.isBlank(text)
          @page = new @App.Page

        it "should be valid", ->
          @page.set(text: "teste")
          chai.expect([@page.isValid(), @page.errors]).to.be.deep.equal([true, []])

        it "should not be valid", ->
          @page.set(text: "")
          chai.expect([@page.isValid(), @page.errors]).to.be.deep.equal([false, ["text"]])

      describe "computed attributes", ->
        before ->
          @App.Book::computedAttributes = full_title: "fullTitle"
          @App.Book::fullTitle = -> "#{@get("title")} by #{@get("author")}"

        it "should get attribute", ->
          book = new @App.Book(title: "Hipbone", author: "Mateus")
          chai.expect(book.get("full_title")).to.be.equal("Hipbone by Mateus")

      describe "nested attributes", ->
        before ->
          @book = new @App.Book(image: size: large: "http://...")

        it "should get attribute", ->
          chai.expect(@book.get("image.size.large")).to.be.equal("http://...")

        it "should trigger event", (done) ->
          @book.on "change:image.size.large", =>
            chai.expect(@book.get("image.size.large")).to.be.equal("https://...")
            done()
          @book.set("image.size.large", "https://...")

      describe "json", ->
        before ->
          @book = new @App.Book(id: 5, title: "Hipbone", author: "Mateus", pages: [{book_id: 5}, {book_id: 5}])

        it "should include by default cid and computed attributes", ->
          chai.expect(_.keys(@book.toJSON())).to.be.deep.equal(["id", "title", "author", "type", "cid", "full_title"])

        it "should behave as backbone when sync", ->
          chai.expect(_.keys(@book.toJSON(sync: true))).to.be.deep.equal(["id", "title", "author", "type"])

        it "should include mappings when requested", ->
          chai.expect(_.path(@book.toJSON(mappings: {pages: {mappings: book: {}}}), "pages.models.1.book.id")).to.be.equal(5)

    describe "Collection", ->
      describe "parent", ->
        before ->
          @App.Page::urlRoot = "/pages"
          @App.Annotations::urlRoot = "/annotations"

          @page = new @App.Page(id: 1)
          @annotations = new @App.Annotations([], parent: @page)

        it "should initialize", ->
          chai.expect(@annotations.parent).to.be.equal(@page)

        it "should compose url", ->
          chai.expect(@annotations.url()).to.be.equal("/pages/1/annotations")

      describe "meta", ->
        it "should initialize", ->
          collection = new Hipbone.Collection([], meta: count: 10)
          chai.expect(collection.getMeta("count")).to.be.equal(10)

      describe "identity map", ->
        it "should be equal with parent", ->
          model = new Hipbone.Model
          collection = new Hipbone.Collection([], parent: model)
          chai.expect(collection).to.be.equal(new Hipbone.Collection([], parent: model))

        it "should be different without parent", ->
          collection = new Hipbone.Collection([])
          chai.expect(collection).to.not.be.equal(new Hipbone.Collection([]))

      describe "dynamic model", ->
        it "should set model", ->
          annotation1 = new @App.AuthorAnnotation(id: 1)
          annotation2 = new @App.ReaderAnnotation(id: 1)
          annotations = new @App.Annotations([annotation1, annotation2])
          chai.expect(annotations.map (annotation) -> annotation.id).to.be.deep.equal([1, 1])

        it "should set object", ->
          annotation1 = id: 1, type: "AuthorAnnotation"
          annotation2 = id: 1, type: "ReaderAnnotation"
          annotations = new @App.Annotations([annotation1, annotation2])
          chai.expect(annotations.map (annotation) -> annotation.id).to.be.deep.equal([1, 1])

      describe "limit + offset", ->

      describe "json", ->
        before ->
          @pages = new @App.Pages([{id: 1}, {id: 2}])

        it "should include by default cid, meta and helpers", ->
          chai.expect(_.keys(@pages.toJSON())).to.be.deep.equal(["offset", "limit", "length", "cid", "models"])

        it "should behave as backbone when sync", ->
          chai.expect(@pages.toJSON(sync: true)).to.be.deep.equal([{id: 1, type: "Page"}, {id: 2, type: "Page"}])
