(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  if (navigator.userAgent.indexOf('PhantomJS') < 0) {
    chai.Assertion.addProperty('model', function() {
      return this._obj instanceof Hipbone.Model;
    });
    chai.Assertion.addProperty('collection', function() {
      return this._obj instanceof Hipbone.Collection;
    });
    describe("hipbone", function() {
      before(function() {
        var App;
        window.App = this.App = App = App = (function(superClass) {
          extend(App, superClass);

          function App() {
            return App.__super__.constructor.apply(this, arguments);
          }

          return App;

        })(Hipbone.Application);
        App.Book = (function(superClass) {
          extend(Book, superClass);

          function Book() {
            return Book.__super__.constructor.apply(this, arguments);
          }

          Book.prototype.mappings = {
            pages: "Pages"
          };

          return Book;

        })(Hipbone.Model);
        App.Page = (function(superClass) {
          extend(Page, superClass);

          function Page() {
            return Page.__super__.constructor.apply(this, arguments);
          }

          Page.prototype.mappings = {
            book: "Book",
            annotations: "Annotations"
          };

          Page.prototype.polymorphics = ["top_annotation"];

          return Page;

        })(Hipbone.Model);
        App.Pages = (function(superClass) {
          extend(Pages, superClass);

          function Pages() {
            return Pages.__super__.constructor.apply(this, arguments);
          }

          Pages.prototype.model = App.Page;

          return Pages;

        })(Hipbone.Collection);
        App.ReaderAnnotation = (function(superClass) {
          extend(ReaderAnnotation, superClass);

          function ReaderAnnotation() {
            return ReaderAnnotation.__super__.constructor.apply(this, arguments);
          }

          return ReaderAnnotation;

        })(Hipbone.Model);
        App.AuthorAnnotation = (function(superClass) {
          extend(AuthorAnnotation, superClass);

          function AuthorAnnotation() {
            return AuthorAnnotation.__super__.constructor.apply(this, arguments);
          }

          return AuthorAnnotation;

        })(Hipbone.Model);
        App.Annotations = (function(superClass) {
          extend(Annotations, superClass);

          function Annotations() {
            return Annotations.__super__.constructor.apply(this, arguments);
          }

          return Annotations;

        })(Hipbone.Collection);
        this.app = new App;
        return this.app.run();
      });
      return describe("Model", function() {
        before(function() {
          return this.model = new Hipbone.Model;
        });
        describe("identity map", function() {
          it("should be equal", function() {
            var modelWithId;
            modelWithId = new Hipbone.Model({
              id: 1
            });
            return chai.expect(modelWithId).to.equal(new Hipbone.Model({
              id: 1
            }));
          });
          return it("should be diff", function() {
            var modelWithoutId;
            modelWithoutId = new Hipbone.Model;
            return chai.expect(modelWithoutId).to.not.equal(new Hipbone.Model);
          });
        });
        describe("mappings", function() {
          describe("model", function() {
            it("should be null by default", function() {
              var page;
              page = new this.App.Page;
              return chai.should(page.get("book")).not.exist;
            });
            it("should map for id", function() {
              var book, page;
              book = new this.App.Book({
                id: 1
              });
              page = new this.App.Page({
                book_id: 1
              });
              return chai.expect(page.get("book")).to.equal(book);
            });
            it("should map for transient", function() {
              var book, page;
              book = new this.App.Book;
              page = new this.App.Page({
                book: book
              });
              return chai.expect(page.get("book")).to.equal(book);
            });
            return it("should parse object", function() {
              var page;
              page = new this.App.Page({
                book: {
                  id: 1
                }
              });
              return chai.expect(page.get("book").id).to.equal(1);
            });
          });
          describe("polymorphic", function() {
            it("should be null by default", function() {
              var page;
              page = new this.App.Page;
              return chai.should(page.get("top_annotation_id")).not.exist;
            });
            it("should map for id and type", function() {
              var annotation, page;
              annotation = new this.App.ReaderAnnotation({
                id: 1
              });
              page = new this.App.Page({
                top_annotation_id: 1,
                top_annotation_type: "ReaderAnnotation"
              });
              return chai.expect(page.get("top_annotation")).to.equal(annotation);
            });
            it("should map for transient", function() {
              var annotation, page;
              annotation = new this.App.ReaderAnnotation({
                id: 1
              });
              page = new this.App.Page({
                top_annotation: annotation
              });
              return chai.expect(page.get("top_annotation")).to.equal(annotation);
            });
            return it("should parse object", function() {
              var page;
              page = new this.App.Page({
                top_annotation: {
                  id: 1,
                  type: "ReaderAnnotation"
                }
              });
              return chai.expect(page.get("top_annotation").id).to.equal(1);
            });
          });
          return describe("collection", function() {
            it("should be a collection by default", function() {
              var book;
              book = new this.App.Book;
              return chai.expect(book.get("pages")).to.be.a.collection;
            });
            it("should map", function() {
              var book;
              book = new this.App.Book;
              return chai.expect(book.get("pages").parent).to.be.equal(book);
            });
            it("should parse array", function() {
              var book;
              book = new this.App.Book({
                pages: [
                  {
                    id: 1
                  }
                ]
              });
              return chai.expect(book.get("pages").first().id).to.be.equal(1);
            });
            return it("should parse {models: [], meta: {}}", function() {
              var book;
              book = new this.App.Book({
                pages: {
                  models: [
                    {
                      id: 1
                    }
                  ]
                }
              });
              return chai.expect(book.get("pages").first().id).to.be.equal(1);
            });
          });
        });
        describe("validation", function() {
          return it("to-do", function() {});
        });
        return describe("computed attributes", function() {
          return it("to-do", function() {});
        });
      });
    });
  }

}).call(this);
