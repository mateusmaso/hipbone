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

          return Book;

        })(Hipbone.Model);
        App.Page = (function(superClass) {
          extend(Page, superClass);

          function Page() {
            return Page.__super__.constructor.apply(this, arguments);
          }

          return Page;

        })(Hipbone.Model);
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
        App.Pages = (function(superClass) {
          extend(Pages, superClass);

          function Pages() {
            return Pages.__super__.constructor.apply(this, arguments);
          }

          return Pages;

        })(Hipbone.Collection);
        this.app = new App;
        return this.app.run();
      });
      describe("Model", function() {
        describe("identity map", function() {
          it("should be equal with id", function() {
            var model;
            model = new Hipbone.Model({
              id: 1
            });
            return chai.expect(model).to.equal(new Hipbone.Model({
              id: 1
            }));
          });
          return it("should be different without id", function() {
            var model;
            model = new Hipbone.Model;
            return chai.expect(model).to.not.equal(new Hipbone.Model);
          });
        });
        describe("mappings", function() {
          before(function() {
            this.App.Book.prototype.mappings = {
              pages: "Pages"
            };
            this.App.Page.prototype.mappings = {
              book: "Book"
            };
            this.App.Page.prototype.polymorphics = ["top_annotation"];
            return this.App.Pages.prototype.model = App.Page;
          });
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
        describe("validations", function() {
          before(function() {
            this.App.Page.prototype.validations = {
              text: function(text) {
                return !_.string.isBlank(text);
              }
            };
            return this.page = new this.App.Page;
          });
          it("should be valid", function() {
            this.page.set({
              text: "teste"
            });
            return chai.expect([this.page.isValid(), this.page.errors]).to.be.deep.equal([true, []]);
          });
          return it("should not be valid", function() {
            this.page.set({
              text: ""
            });
            return chai.expect([this.page.isValid(), this.page.errors]).to.be.deep.equal([false, ["text"]]);
          });
        });
        describe("computed attributes", function() {
          before(function() {
            this.App.Book.prototype.computedAttributes = {
              full_title: "fullTitle"
            };
            return this.App.Book.prototype.fullTitle = function() {
              return (this.get("title")) + " by " + (this.get("author"));
            };
          });
          return it("should get attribute", function() {
            var book;
            book = new this.App.Book({
              title: "Hipbone",
              author: "Mateus"
            });
            return chai.expect(book.get("full_title")).to.be.equal("Hipbone by Mateus");
          });
        });
        describe("nested attributes", function() {
          before(function() {
            return this.book = new this.App.Book({
              image: {
                size: {
                  large: "http://..."
                }
              }
            });
          });
          it("should get attribute", function() {
            return chai.expect(this.book.get("image.size.large")).to.be.equal("http://...");
          });
          return it("should trigger event", function(done) {
            this.book.on("change:image.size.large", (function(_this) {
              return function() {
                chai.expect(_this.book.get("image.size.large")).to.be.equal("https://...");
                return done();
              };
            })(this));
            return this.book.set("image.size.large", "https://...");
          });
        });
        return describe("json", function() {
          before(function() {
            return this.book = new this.App.Book({
              id: 5,
              title: "Hipbone",
              author: "Mateus",
              pages: [
                {
                  book_id: 5
                }, {
                  book_id: 5
                }
              ]
            });
          });
          it("should include by default cid and computed attributes", function() {
            return chai.expect(_.keys(this.book.toJSON())).to.be.deep.equal(["id", "title", "author", "type", "cid", "full_title"]);
          });
          it("should behave as backbone when sync", function() {
            return chai.expect(_.keys(this.book.toJSON({
              sync: true
            }))).to.be.deep.equal(["id", "title", "author", "type"]);
          });
          return it("should include mappings when requested", function() {
            return chai.expect(_.path(this.book.toJSON({
              mappings: {
                pages: {
                  mappings: {
                    book: {}
                  }
                }
              }
            }), "pages.models.1.book.id")).to.be.equal(5);
          });
        });
      });
      return describe("Collection", function() {
        describe("parent", function() {
          before(function() {
            this.App.Page.prototype.urlRoot = "/pages";
            this.App.Annotations.prototype.urlRoot = "/annotations";
            this.page = new this.App.Page({
              id: 1
            });
            return this.annotations = new this.App.Annotations([], {
              parent: this.page
            });
          });
          it("should initialize", function() {
            return chai.expect(this.annotations.parent).to.be.equal(this.page);
          });
          return it("should compose url", function() {
            return chai.expect(this.annotations.url()).to.be.equal("/pages/1/annotations");
          });
        });
        describe("meta", function() {
          return it("should initialize", function() {
            var collection;
            collection = new Hipbone.Collection([], {
              meta: {
                count: 10
              }
            });
            return chai.expect(collection.getMeta("count")).to.be.equal(10);
          });
        });
        describe("identity map", function() {
          it("should be equal with parent", function() {
            var collection, model;
            model = new Hipbone.Model;
            collection = new Hipbone.Collection([], {
              parent: model
            });
            return chai.expect(collection).to.be.equal(new Hipbone.Collection([], {
              parent: model
            }));
          });
          return it("should be different without parent", function() {
            var collection;
            collection = new Hipbone.Collection([]);
            return chai.expect(collection).to.not.be.equal(new Hipbone.Collection([]));
          });
        });
        describe("dynamic model", function() {
          it("should set model", function() {
            var annotation1, annotation2, annotations;
            annotation1 = new this.App.AuthorAnnotation({
              id: 1
            });
            annotation2 = new this.App.ReaderAnnotation({
              id: 1
            });
            annotations = new this.App.Annotations([annotation1, annotation2]);
            return chai.expect(annotations.map(function(annotation) {
              return annotation.id;
            })).to.be.deep.equal([1, 1]);
          });
          return it("should set object", function() {
            var annotation1, annotation2, annotations;
            annotation1 = {
              id: 1,
              type: "AuthorAnnotation"
            };
            annotation2 = {
              id: 1,
              type: "ReaderAnnotation"
            };
            annotations = new this.App.Annotations([annotation1, annotation2]);
            return chai.expect(annotations.map(function(annotation) {
              return annotation.id;
            })).to.be.deep.equal([1, 1]);
          });
        });
        describe("limit + offset", function() {});
        return describe("json", function() {
          before(function() {
            return this.pages = new this.App.Pages([
              {
                id: 1
              }, {
                id: 2
              }
            ]);
          });
          it("should include by default cid, meta and helpers", function() {
            return chai.expect(_.keys(this.pages.toJSON())).to.be.deep.equal(["offset", "limit", "length", "cid", "models"]);
          });
          return it("should behave as backbone when sync", function() {
            return chai.expect(this.pages.toJSON({
              sync: true
            })).to.be.deep.equal([
              {
                id: 1,
                type: "Page"
              }, {
                id: 2,
                type: "Page"
              }
            ]);
          });
        });
      });
    });
  }

}).call(this);
