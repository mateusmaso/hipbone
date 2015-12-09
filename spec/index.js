// hipbone
// ------------------
// v1.0.0
//
// Copyright (c) 2012-2015 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/hipbone


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("ajax", function() {
      it("should prepend host url", function() {
        var Application, app;
        Application = (function(superClass) {
          extend(Application, superClass);

          function Application() {
            return Application.__super__.constructor.apply(this, arguments);
          }

          Application.prototype.host = "/api/v1";

          return Application;

        })(Hipbone.Application);
        app = new Application;
        return chai.expect(app.ajaxUrl("/ping")).to.be.equal("/api/v1/ping");
      });
      return it("should add http headers", function() {
        var Application, app;
        Application = (function(superClass) {
          extend(Application, superClass);

          function Application() {
            return Application.__super__.constructor.apply(this, arguments);
          }

          Application.prototype.headers = {
            "X-CSRF-Token": "abc",
            "X-Auth-Token": function() {
              return this.get("authToken");
            }
          };

          return Application;

        })(Hipbone.Application);
        app = new Application({
          authToken: 123
        });
        return chai.expect(app.ajaxHeaders()).to.be.deep.equal({
          "X-Auth-Token": 123,
          "X-CSRF-Token": "abc"
        });
      });
    });
  };

}).call(this);

},{}],2:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("parse body", function() {
      return it("should parse view element", function() {
        var app;
        $("#fixtures").append("<hb-view id='test'></hb-view>");
        app = new Hipbone.Application;
        app.run();
        return chai.should($("#fixtures").find("#test")[0].hipboneView).exist;
      });
    });
  };

}).call(this);

},{}],3:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("parse model", function() {
      it("should parse model", function() {
        var app, model;
        app = new Hipbone.Application;
        model = new Hipbone.Model;
        return chai.expect(Handlebars.parseValue(Handlebars.compile("{{model}}")({
          model: model.toJSON()
        }))).to.be.equal(model);
      });
      return it("should parse collection", function() {
        var app, collection;
        app = new Hipbone.Application;
        collection = new Hipbone.Collection;
        return chai.expect(Handlebars.parseValue(Handlebars.compile("{{collection}}")({
          collection: collection.toJSON()
        }))).to.be.equal(collection);
      });
    });
  };

}).call(this);

},{}],4:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("register helpers", function() {
      it("should get asset path", function() {
        var app;
        app = new Hipbone.Application({
          assets: {
            foo: "bar"
          }
        });
        return chai.expect(Handlebars.compile("{{asset 'foo'}}")()).to.be.equal("bar");
      });
      it("should translate key", function() {
        var Application, app;
        Application = (function(superClass) {
          extend(Application, superClass);

          function Application() {
            return Application.__super__.constructor.apply(this, arguments);
          }

          Application.prototype.locales = {
            en: {
              foo: {
                other: "{{count}} bars"
              }
            }
          };

          return Application;

        })(Hipbone.Application);
        app = new Application;
        return chai.expect(Handlebars.compile("{{t 'foo' count=3}}")()).to.be.equal("3 bars");
      });
      it("should route url", function() {
        var app;
        app = new Hipbone.Application;
        app.router.match("test", {
          route: Hipbone.Route,
          name: "test",
          url: "/test"
        });
        return chai.expect(Handlebars.compile("{{url 'test'}}")()).to.be.equal("/test");
      });
      it("should format string", function() {
        var app;
        app = new Hipbone.Application;
        return chai.expect(Handlebars.compile("{{fmt '%@' 123}}")()).to.be.equal("123");
      });
      it("should eval expression", function() {
        var app;
        app = new Hipbone.Application;
        return chai.expect(Handlebars.compile("{{eval '1 + 1'}}")()).to.be.equal("2");
      });
      it("should render template", function() {
        var View, app, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.templatePath = "/path";

          View.prototype.templates = {
            "/path/test": Handlebars.compile("test")
          };

          return View;

        })(Hipbone.View);
        view = new View;
        app = new Hipbone.Application;
        return chai.expect(Handlebars.compile("{{template '/test'}}")(view._context)).to.be.equal("test");
      });
      it("#each should work with collection", function() {
        var app, collection;
        app = new Hipbone.Application;
        collection = new Hipbone.Collection([
          {
            text: "hello"
          }, {
            text: "world"
          }
        ]);
        return chai.expect(Handlebars.compile("{{#each collection var='model'}}{{model.text}}{{/each}}")({
          collection: collection.toJSON()
        })).to.be.equal("helloworld");
      });
      return it("#if should work with collection", function() {
        var app, collection;
        app = new Hipbone.Application;
        collection = new Hipbone.Collection([]);
        return chai.expect(Handlebars.compile("{{#if collection}}coco{{/if}}")({
          collection: collection.toJSON()
        })).to.be.equal("");
      });
    });
  };

}).call(this);

},{}],5:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("initializers", function() {
      it("should run initializers with options", function() {
        var Application, app, initializers;
        initializers = [];
        initializers.push(function() {
          return this.get("output").push("foo");
        });
        initializers.push(function(options) {
          if (options.bar) {
            return this.get("output").push("bar");
          }
        });
        Application = (function(superClass) {
          extend(Application, superClass);

          function Application() {
            return Application.__super__.constructor.apply(this, arguments);
          }

          Application.prototype.initializers = initializers;

          return Application;

        })(Hipbone.Application);
        app = new Application({
          output: []
        }, {
          bar: true
        });
        return chai.expect(app.get("output")).to.be.deep.equal(["foo", "bar"]);
      });
      require("./initializers/parse_body_spec").apply(this);
      require("./initializers/parse_model_spec").apply(this);
      return require("./initializers/register_helpers_spec").apply(this);
    });
  };

}).call(this);

},{"./initializers/parse_body_spec":2,"./initializers/parse_model_spec":3,"./initializers/register_helpers_spec":4}],6:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("locale", function() {
      it("should initialize i18n with english locale as default", function() {
        var Application, app;
        Application = (function(superClass) {
          extend(Application, superClass);

          function Application() {
            return Application.__super__.constructor.apply(this, arguments);
          }

          Application.prototype.locales = {
            en: {
              hello: "Hello"
            }
          };

          return Application;

        })(Hipbone.Application);
        app = new Application;
        return chai.expect(app.i18n.translate("hello")).to.be.equal("Hello");
      });
      return it("should initialize i18n with specified locale", function() {
        var Application, app;
        Application = (function(superClass) {
          extend(Application, superClass);

          function Application() {
            return Application.__super__.constructor.apply(this, arguments);
          }

          Application.prototype.locales = {
            "pt-BR": {
              hello: "Olá"
            }
          };

          return Application;

        })(Hipbone.Application);
        app = new Application({}, {
          locale: "pt-BR"
        });
        return chai.expect(app.i18n.translate("hello")).to.be.equal("Olá");
      });
    });
  };

}).call(this);

},{}],7:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("state", function() {
      it("should initialize state and defaults", function() {
        var Application, app;
        Application = (function(superClass) {
          extend(Application, superClass);

          function Application() {
            return Application.__super__.constructor.apply(this, arguments);
          }

          Application.prototype.defaults = {
            bar: 2
          };

          return Application;

        })(Hipbone.Application);
        app = new Application({
          foo: 1
        });
        return chai.expect([app.state.get("foo"), app.state.get("bar")]).to.be.deep.equal([1, 2]);
      });
      it("should get/set", function() {
        var app;
        app = new Hipbone.Application;
        app.set({
          foo: 123
        });
        app.set("bar", 321);
        return chai.expect([app.get("foo"), app.get("bar")]).to.be.deep.equal([123, 321]);
      });
      return it("should listen to events", function() {
        var app, changed;
        changed = false;
        app = new Hipbone.Application;
        app.on("change", (function(_this) {
          return function() {
            return changed = true;
          };
        })(this));
        app.set({
          hello: "world"
        });
        return chai.expect(changed).to.be["true"];
      });
    });
  };

}).call(this);

},{}],8:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Application", function() {
      require("./application/ajax_spec").apply(this);
      require("./application/state_spec").apply(this);
      require("./application/locale_spec").apply(this);
      return require("./application/initializers_spec").apply(this);
    });
  };

}).call(this);

},{"./application/ajax_spec":1,"./application/initializers_spec":5,"./application/locale_spec":6,"./application/state_spec":7}],9:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("filters", function() {
      return it("should be in query url params", function() {
        var Collection, collection;
        Collection = (function(superClass) {
          extend(Collection, superClass);

          function Collection() {
            return Collection.__super__.constructor.apply(this, arguments);
          }

          Collection.prototype.urlRoot = "/models";

          Collection.prototype.filters = {
            filter: true
          };

          return Collection;

        })(Hipbone.Collection);
        collection = new Collection;
        return chai.expect(collection.url()).to.be.equal("/models?filter=true");
      });
    });
  };

}).call(this);

},{}],10:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("meta", function() {
      before(function() {
        return this.collection = new Hipbone.Collection;
      });
      it("should initialize meta and defaults", function() {
        var Collection, collection;
        Collection = (function(superClass) {
          extend(Collection, superClass);

          function Collection() {
            return Collection.__super__.constructor.apply(this, arguments);
          }

          Collection.prototype.defaults = {
            max: 50
          };

          return Collection;

        })(Hipbone.Collection);
        collection = new Collection({
          meta: {
            count: 10
          }
        });
        return chai.expect([collection.meta.get("count"), collection.meta.get("max")]).to.be.deep.equal([10, 50]);
      });
      it("should listen to events", function() {
        var changed, collection;
        changed = false;
        collection = new Hipbone.Collection;
        collection.on("meta:change", (function(_this) {
          return function() {
            return changed = true;
          };
        })(this));
        collection.meta.set({
          hello: "world"
        });
        return chai.expect(changed).to.be["true"];
      });
      it("should not increment/decrement counter when parse", function() {
        this.collection.meta.set({
          count: 2
        });
        this.collection.set([
          {
            id: 3
          }, {
            id: 4
          }
        ], {
          parse: true
        });
        return chai.expect(this.collection.meta.get("count")).to.be.equal(2);
      });
      it("should increment counter on add", function() {
        this.collection.add({
          id: 5
        });
        return chai.expect(this.collection.meta.get("count")).to.be.equal(3);
      });
      return it("should decrement counter on remove", function() {
        this.collection.pop();
        return chai.expect(this.collection.meta.get("count")).to.be.equal(2);
      });
    });
  };

}).call(this);

},{}],11:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("pagination", function() {
      before(function() {
        var Collection;
        Collection = (function(superClass) {
          extend(Collection, superClass);

          function Collection() {
            return Collection.__super__.constructor.apply(this, arguments);
          }

          Collection.prototype.urlRoot = "/models";

          Collection.prototype.pagination = {
            offset: 0,
            limit: 10
          };

          return Collection;

        })(Hipbone.Collection);
        return this.collection = new Collection;
      });
      it("should increment pagination", function() {
        this.collection.incrementPagination();
        return chai.expect(this.collection.url({
          paginate: true
        })).to.be.equal("/models?limit=10&offset=10");
      });
      it("should decrement pagination", function() {
        this.collection.decrementPagination();
        return chai.expect(this.collection.url({
          paginate: true
        })).to.be.equal("/models?limit=10&offset=0");
      });
      return it("should fetch only models since beginning", function() {
        this.collection.incrementPagination();
        this.collection.incrementPagination();
        return chai.expect(this.collection.url()).to.be.equal("/models?limit=30&offset=0");
      });
    });
  };

}).call(this);

},{}],12:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("parent", function() {
      before(function() {
        var Collection, Model;
        Model = (function(superClass) {
          extend(Model, superClass);

          function Model() {
            return Model.__super__.constructor.apply(this, arguments);
          }

          Model.prototype.urlRoot = "/url";

          return Model;

        })(Hipbone.Model);
        Collection = (function(superClass) {
          extend(Collection, superClass);

          function Collection() {
            return Collection.__super__.constructor.apply(this, arguments);
          }

          Collection.prototype.model = Model;

          Collection.prototype.urlRoot = "/models";

          return Collection;

        })(Hipbone.Collection);
        this.model = new Model({
          id: 1
        });
        return this.collection = new Collection({
          parent: this.model
        });
      });
      it("should initialize", function() {
        return chai.expect(this.collection.parent).to.be.equal(this.model);
      });
      return it("should compose url", function() {
        return chai.expect(this.collection.url()).to.be.equal("/url/1/models");
      });
    });
  };

}).call(this);

},{}],13:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("polymorphic", function() {
      var Annotations, AuthorAnnotation, ReaderAnnotation;
      ReaderAnnotation = (function(superClass) {
        extend(ReaderAnnotation, superClass);

        function ReaderAnnotation() {
          return ReaderAnnotation.__super__.constructor.apply(this, arguments);
        }

        ReaderAnnotation.register("ReaderAnnotation");

        return ReaderAnnotation;

      })(Hipbone.Model);
      AuthorAnnotation = (function(superClass) {
        extend(AuthorAnnotation, superClass);

        function AuthorAnnotation() {
          return AuthorAnnotation.__super__.constructor.apply(this, arguments);
        }

        AuthorAnnotation.register("AuthorAnnotation");

        return AuthorAnnotation;

      })(Hipbone.Model);
      Annotations = (function(superClass) {
        extend(Annotations, superClass);

        function Annotations() {
          return Annotations.__super__.constructor.apply(this, arguments);
        }

        Annotations.prototype.model = [ReaderAnnotation, AuthorAnnotation];

        Annotations.register("Annotations");

        return Annotations;

      })(Hipbone.Collection);
      describe("model", function() {
        it("should initialize", function() {
          var annotation1, annotation2, annotation3, annotation4, annotations;
          annotation1 = new AuthorAnnotation({
            id: 1
          });
          annotation2 = new AuthorAnnotation({
            id: 2
          });
          annotation3 = new ReaderAnnotation({
            id: 3
          });
          annotation4 = new ReaderAnnotation({
            id: 4
          });
          annotations = new Annotations([annotation1, annotation2, annotation3, annotation4]);
          return chai.expect(annotations.map(function(annotation) {
            return annotation.id;
          })).to.be.deep.equal([1, 2, 3, 4]);
        });
        return it("should set", function() {
          var annotation1, annotation2, annotations;
          annotation1 = new AuthorAnnotation({
            id: 5
          });
          annotation2 = new AuthorAnnotation({
            id: 6
          });
          annotations = new Annotations();
          annotations.set([annotation1, annotation2]);
          return chai.expect(annotations.map(function(annotation) {
            return annotation.id;
          })).to.be.deep.equal([5, 6]);
        });
      });
      return describe("object", function() {
        it("should initialize", function() {
          var annotation1, annotation2, annotation3, annotation4, annotations;
          annotation1 = {
            id: 1,
            type: "AuthorAnnotation"
          };
          annotation2 = {
            id: 2,
            type: "AuthorAnnotation"
          };
          annotation3 = {
            id: 3,
            type: "ReaderAnnotation"
          };
          annotation4 = {
            id: 4,
            type: "ReaderAnnotation"
          };
          annotations = new Annotations([annotation1, annotation2, annotation3, annotation4]);
          return chai.expect(annotations.map(function(annotation) {
            return annotation.id;
          })).to.be.deep.equal([1, 2, 3, 4]);
        });
        return it("should set", function() {
          var annotation1, annotation2, annotations;
          annotation1 = {
            id: 5,
            type: "AuthorAnnotation"
          };
          annotation2 = {
            id: 6,
            type: "ReaderAnnotation"
          };
          annotations = new Annotations();
          annotations.set([annotation1, annotation2]);
          return chai.expect(annotations.map(function(annotation) {
            return annotation.id;
          })).to.be.deep.equal([5, 6]);
        });
      });
    });
  };

}).call(this);

},{}],14:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("populate", function() {
      it("should populate", function() {
        var Collection, collection, deferred;
        deferred = $.Deferred();
        Collection = (function(superClass) {
          extend(Collection, superClass);

          function Collection() {
            return Collection.__super__.constructor.apply(this, arguments);
          }

          Collection.prototype.populate = function() {
            return deferred.resolve();
          };

          return Collection;

        })(Hipbone.Collection);
        collection = new Collection;
        collection.prepare();
        return chai.expect(deferred).to.be.fulfilled;
      });
      return it("should not populate", function() {
        var Collection, collection, deferred;
        deferred = $.Deferred();
        Collection = (function(superClass) {
          extend(Collection, superClass);

          function Collection() {
            return Collection.__super__.constructor.apply(this, arguments);
          }

          Collection.prototype.populate = function() {
            return deferred.resolve();
          };

          return Collection;

        })(Hipbone.Collection);
        collection = new Collection;
        collection.didSync();
        collection.prepare();
        return chai.expect(deferred).to.not.be.fulfilled;
      });
    });
  };

}).call(this);

},{}],15:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("store", function() {
      it("should be equal with parent", function() {
        var collection, model;
        model = new Hipbone.Model;
        collection = new Hipbone.Collection({
          parent: model
        });
        return chai.expect(collection).to.be.equal(new Hipbone.Collection({
          parent: model
        }));
      });
      return it("should be different without parent", function() {
        var collection;
        collection = new Hipbone.Collection;
        return chai.expect(collection).to.not.be.equal(new Hipbone.Collection);
      });
    });
  };

}).call(this);

},{}],16:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("sync", function() {
      it("should set synced and trigger", function() {
        var collection, synced;
        synced = null;
        collection = new Hipbone.Collection;
        collection.on("synced", function() {
          return synced = this.synced;
        });
        collection.didSync();
        return chai.expect(synced).to.be.equal(collection.synced);
      });
      return it("should unset synced and trigger", function() {
        var collection, synced;
        synced = 123;
        collection = new Hipbone.Collection;
        collection.on("unsync", function() {
          return synced = this.synced;
        });
        collection.unsync();
        return chai.expect(synced).to.be.equal(void 0);
      });
    });
  };

}).call(this);

},{}],17:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Collection", function() {
      require("./collection/sync_spec").apply(this);
      require("./collection/meta_spec").apply(this);
      require("./collection/store_spec").apply(this);
      require("./collection/parent_spec").apply(this);
      require("./collection/filters_spec").apply(this);
      require("./collection/populate_spec").apply(this);
      require("./collection/pagination_spec").apply(this);
      require("./collection/polymorphic_spec").apply(this);
      return describe("json", function() {
        before(function() {
          return this.collection = new Hipbone.Collection([
            {
              id: 1
            }, {
              id: 2
            }
          ], {
            meta: {
              count: 10
            }
          });
        });
        it("should include by default cid, meta and helpers", function() {
          return chai.expect(this.collection.toJSON()).to.be.deep.equal({
            cid: this.collection.cid,
            length: 2,
            meta: {
              cid: this.collection.meta.cid,
              count: 10
            },
            models: [
              {
                cid: this.collection.at(0).cid,
                id: 1
              }, {
                cid: this.collection.at(1).cid,
                id: 2
              }
            ]
          });
        });
        return it("should behave as backbone when sync", function() {
          return chai.expect(this.collection.toJSON({
            sync: true
          })).to.be.deep.equal([
            {
              id: 1
            }, {
              id: 2
            }
          ]);
        });
      });
    });
  };

}).call(this);

},{"./collection/filters_spec":9,"./collection/meta_spec":10,"./collection/pagination_spec":11,"./collection/parent_spec":12,"./collection/polymorphic_spec":13,"./collection/populate_spec":14,"./collection/store_spec":15,"./collection/sync_spec":16}],18:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("I18n", function() {
      var i18n;
      i18n = new Hipbone.I18n("en", {
        en: {
          hello: "Hello {{name}}!",
          baby: {
            male: "it's a boy",
            female: "it's a girl",
            neutral: "not sure"
          },
          comment: {
            zero: "no comments yet",
            one: "{{count}} comment",
            other: "{{count}} comments"
          }
        }
      });
      describe("interpolate", function() {
        return it("should interpolate variable", function() {
          return chai.expect(i18n.translate("hello", {
            name: "World"
          })).to.be.equal("Hello World!");
        });
      });
      describe("pluralize", function() {
        it("should be zero", function() {
          return chai.expect(i18n.translate("comment", {
            count: 0
          })).to.be.equal("no comments yet");
        });
        it("should be one", function() {
          return chai.expect(i18n.translate("comment", {
            count: 1
          })).to.be.equal("1 comment");
        });
        return it("should be other", function() {
          return chai.expect(i18n.translate("comment", {
            count: 2
          })).to.be.equal("2 comments");
        });
      });
      return describe("inflector", function() {
        it("should be male", function() {
          return chai.expect(i18n.translate("baby", {
            gender: "m"
          })).to.be.equal("it's a boy");
        });
        it("should be female", function() {
          return chai.expect(i18n.translate("baby", {
            gender: "f"
          })).to.be.equal("it's a girl");
        });
        return it("should be neutral", function() {
          return chai.expect(i18n.translate("baby", {
            gender: ""
          })).to.be.equal("not sure");
        });
      });
    });
  };

}).call(this);

},{}],19:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Identity Map", function() {
      var identityMap;
      identityMap = new Hipbone.IdentityMap;
      it("should store/find", function() {
        identityMap.store("foo", "bar");
        return chai.expect(identityMap.find("foo")).to.be.equal("bar");
      });
      it("should store/find all", function() {
        identityMap.storeAll(["foo", "bar"], "bar");
        return chai.expect(identityMap.findAll(["foo", "bar"])).to.be.deep.equal(["bar", "bar"]);
      });
      it("should match", function() {
        identityMap.storeAll(["model123", "view123", "collection123"], "test");
        return chai.expect(identityMap.match(/view/)).to.be.deep.equal({
          "view123": "test"
        });
      });
      it("should delete", function() {
        identityMap["delete"]("foo");
        return chai.should(identityMap.find("foo")).not.exist;
      });
      it("should delete all", function() {
        identityMap.deleteAll(["foo", "bar"]);
        return chai.should(identityMap.find("foo")).not.exist;
      });
      return it("should clear", function() {
        identityMap.clear();
        return chai.expect(_.keys(identityMap.instances).length).to.be.equal(0);
      });
    });
  };

}).call(this);

},{}],20:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("computed attributes", function() {
      return it("should get attribute", function() {
        var Model, model;
        Model = (function(superClass) {
          extend(Model, superClass);

          function Model() {
            return Model.__super__.constructor.apply(this, arguments);
          }

          Model.prototype.computedAttributes = {
            description: "description"
          };

          Model.prototype.description = function() {
            return "Title: " + (this.get("title"));
          };

          return Model;

        })(Hipbone.Model);
        model = new Model({
          title: "Hipbone"
        });
        return chai.expect(model.get("description")).to.be.equal("Title: Hipbone");
      });
    });
  };

}).call(this);

},{}],21:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("mappings", function() {
      var Book, Page, Pages, ReaderAnnotation;
      Book = (function(superClass) {
        extend(Book, superClass);

        function Book() {
          return Book.__super__.constructor.apply(this, arguments);
        }

        Book.prototype.mappings = {
          pages: function() {
            return Pages;
          }
        };

        Book.register("Book");

        return Book;

      })(Hipbone.Model);
      Page = (function(superClass) {
        extend(Page, superClass);

        function Page() {
          return Page.__super__.constructor.apply(this, arguments);
        }

        Page.prototype.mappings = {
          book: function() {
            return Book;
          },
          top_annotation: function() {
            return [ReaderAnnotation];
          }
        };

        Page.register("Page");

        return Page;

      })(Hipbone.Model);
      Pages = (function(superClass) {
        extend(Pages, superClass);

        function Pages() {
          return Pages.__super__.constructor.apply(this, arguments);
        }

        Pages.prototype.model = Page;

        Pages.register("Pages");

        return Pages;

      })(Hipbone.Collection);
      ReaderAnnotation = (function(superClass) {
        extend(ReaderAnnotation, superClass);

        function ReaderAnnotation() {
          return ReaderAnnotation.__super__.constructor.apply(this, arguments);
        }

        ReaderAnnotation.register("ReaderAnnotation");

        return ReaderAnnotation;

      })(Hipbone.Model);
      describe("model", function() {
        it("should be null by default", function() {
          var page;
          page = new Page;
          return chai.should(page.get("book")).not.exist;
        });
        it("should map for id", function() {
          var book, page;
          book = new Book({
            id: 1
          });
          page = new Page({
            book_id: 1
          });
          return chai.expect(page.get("book")).to.be.equal(book);
        });
        it("should map for transient", function() {
          var book, page;
          book = new Book;
          page = new Page({
            book: book
          });
          return chai.expect(page.get("book")).to.be.equal(book);
        });
        return it("should parse object", function() {
          var page;
          page = new Page({
            book: {
              id: 1
            }
          });
          return chai.expect(page.get("book").id).to.be.equal(1);
        });
      });
      describe("polymorphic", function() {
        it("should be null by default", function() {
          var page;
          page = new Page;
          return chai.should(page.get("top_annotation_id")).not.exist;
        });
        it("should map for id and type", function() {
          var annotation, page;
          annotation = new ReaderAnnotation({
            id: 1
          });
          page = new Page({
            top_annotation_id: 1,
            top_annotation_type: "ReaderAnnotation"
          });
          return chai.expect(page.get("top_annotation")).to.be.equal(annotation);
        });
        it("should map for transient", function() {
          var annotation, page;
          annotation = new ReaderAnnotation({
            id: 1
          });
          page = new Page({
            top_annotation: annotation
          });
          return chai.expect(page.get("top_annotation")).to.be.equal(annotation);
        });
        return it("should parse object", function() {
          var page;
          page = new Page({
            top_annotation: {
              id: 1,
              type: "ReaderAnnotation"
            }
          });
          return chai.expect(page.get("top_annotation").id).to.be.equal(1);
        });
      });
      return describe("collection", function() {
        it("should be a collection by default", function() {
          var book;
          book = new Book;
          return chai.expect(book.get("pages")).to.be.a.collection;
        });
        it("should map", function() {
          var book;
          book = new Book;
          return chai.expect(book.get("pages").parent).to.be.equal(book);
        });
        it("should parse array", function() {
          var book;
          book = new Book({
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
          book = new Book({
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
  };

}).call(this);

},{}],22:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("nested attributes", function() {
      it("should get/set", function() {
        var model;
        model = new Hipbone.Model({
          foo: {
            bar: 123
          }
        });
        model.set("foo.bar", 321);
        return chai.expect(model.get("foo.bar")).to.be.deep.equal(321);
      });
      return it("should listen to changes", function() {
        var changes, model;
        changes = 0;
        model = new Hipbone.Model({
          foo: {
            bar: 123
          }
        });
        model.on("change", (function(_this) {
          return function() {
            return changes++;
          };
        })(this));
        model.on("change:foo", (function(_this) {
          return function() {
            return changes++;
          };
        })(this));
        model.on("change:foo.bar", (function(_this) {
          return function() {
            return changes++;
          };
        })(this));
        model.set("foo.bar", 321);
        return chai.expect(changes).to.be.equal(3);
      });
    });
  };

}).call(this);

},{}],23:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("populate", function() {
      it("should populate", function() {
        var Model, deferred, model;
        deferred = $.Deferred();
        Model = (function(superClass) {
          extend(Model, superClass);

          function Model() {
            return Model.__super__.constructor.apply(this, arguments);
          }

          Model.prototype.populate = function() {
            return deferred.resolve();
          };

          return Model;

        })(Hipbone.Model);
        model = new Model;
        model.prepare();
        return chai.expect(deferred).to.be.fulfilled;
      });
      return it("should not populate", function() {
        var Model, deferred, model;
        deferred = $.Deferred();
        Model = (function(superClass) {
          extend(Model, superClass);

          function Model() {
            return Model.__super__.constructor.apply(this, arguments);
          }

          Model.prototype.populate = function() {
            return deferred.resolve();
          };

          return Model;

        })(Hipbone.Model);
        model = new Model;
        model.didSync();
        model.prepare();
        return chai.expect(deferred).to.not.be.fulfilled;
      });
    });
  };

}).call(this);

},{}],24:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("schemes", function() {
      var Model;
      Model = (function(superClass) {
        extend(Model, superClass);

        function Model() {
          return Model.__super__.constructor.apply(this, arguments);
        }

        Model.prototype.schemes = {
          base: function(attributes) {
            if (attributes == null) {
              attributes = {};
            }
            return _.has(attributes, "id") && _.has(attributes, "title") && _.has(attributes, "created_at");
          },
          preview: function(attributes) {
            if (attributes == null) {
              attributes = {};
            }
            return _.has(attributes, "id") && _.has(attributes, "title");
          },
          other: function(attributes) {
            if (attributes == null) {
              attributes = {};
            }
            return _.has(attributes, "id") && _.has(attributes, "other");
          }
        };

        return Model;

      })(Hipbone.Model);
      return it("should validate schemes", function() {
        var model, schemes;
        model = new Model;
        schemes = model.validateSchemes({
          id: 1,
          title: "test",
          created_at: Date.now()
        });
        return chai.expect(schemes).to.be.deep.equal(["base", "preview"]);
      });
    });
  };

}).call(this);

},{}],25:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("store", function() {
      it("should be equal with id", function() {
        var model;
        model = new Hipbone.Model({
          id: 1
        });
        return chai.expect(model).to.be.equal(new Hipbone.Model({
          id: 1
        }));
      });
      return it("should be different without id", function() {
        var model;
        model = new Hipbone.Model;
        return chai.expect(model).to.not.equal(new Hipbone.Model);
      });
    });
  };

}).call(this);

},{}],26:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("sync", function() {
      it("should set synced and trigger", function() {
        var model, synced;
        synced = null;
        model = new Hipbone.Model;
        model.on("synced", function() {
          return synced = this.synced;
        });
        model.didSync();
        return chai.expect(synced).to.be.equal(model.synced);
      });
      it("should set synced name and trigger", function() {
        var model, previewSynced, synced;
        synced = previewSynced = null;
        model = new Hipbone.Model;
        model.on("synced:preview", function() {
          return previewSynced = this.syncs.preview;
        });
        model.on("synced", function() {
          return synced = this.synced;
        });
        model.didSync("preview");
        return chai.expect([synced, previewSynced]).to.be.deep.equal([model.synced, model.syncs.preview]);
      });
      it("should unset synced and trigger", function() {
        var model, synced;
        synced = 123;
        model = new Hipbone.Model;
        model.on("unsync", function() {
          return synced = this.synced;
        });
        model.unsync();
        return chai.expect(synced).to.be.equal(void 0);
      });
      return it("should unset synced name and trigger", function() {
        var model, previewSynced, synced;
        synced = previewSynced = 123;
        model = new Hipbone.Model;
        model.on("unsync:preview", function() {
          return previewSynced = this.syncs.preview;
        });
        model.on("unsync", function() {
          return synced = this.synced;
        });
        model.unsync("preview");
        return chai.expect([synced, previewSynced]).to.be.deep.equal([void 0, void 0]);
      });
    });
  };

}).call(this);

},{}],27:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("syncs", function() {
      it("should set synced and trigger", function() {
        var model, synced;
        synced = null;
        model = new Hipbone.Model;
        model.on("synced", function() {
          return synced = this.synced;
        });
        model.didSync();
        return chai.expect(synced).to.be.equal(model.synced);
      });
      it("should set synced name and trigger", function() {
        var model, previewSynced, synced;
        synced = previewSynced = null;
        model = new Hipbone.Model;
        model.on("synced:preview", function() {
          return previewSynced = this.syncs.preview;
        });
        model.on("synced", function() {
          return synced = this.synced;
        });
        model.didSync("preview");
        return chai.expect([synced, previewSynced]).to.be.deep.equal([null, model.syncs.preview]);
      });
      it("should unset synced and trigger", function() {
        var model, synced;
        synced = 123;
        model = new Hipbone.Model;
        model.on("unsync", function() {
          return synced = this.synced;
        });
        model.unsync();
        return chai.expect(synced).to.be.equal(void 0);
      });
      return it("should unset synced name and trigger", function() {
        var model, previewSynced, synced;
        synced = previewSynced = 123;
        model = new Hipbone.Model;
        model.on("unsync:preview", function() {
          return previewSynced = this.syncs.preview;
        });
        model.on("unsync", function() {
          return synced = this.synced;
        });
        model.unsync("preview");
        return chai.expect([synced, previewSynced]).to.be.deep.equal([123, void 0]);
      });
    });
  };

}).call(this);

},{}],28:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("validations", function() {
      before(function() {
        var Model;
        Model = (function(superClass) {
          extend(Model, superClass);

          function Model() {
            return Model.__super__.constructor.apply(this, arguments);
          }

          Model.prototype.defaults = {
            text: ""
          };

          Model.prototype.validations = {
            text: function(text) {
              return !_.string.isBlank(text);
            }
          };

          return Model;

        })(Hipbone.Model);
        return this.model = new Model;
      });
      it("should be valid", function() {
        this.model.set({
          text: "teste"
        });
        return chai.expect([this.model.isValid(), this.model.errors]).to.be.deep.equal([true, []]);
      });
      return it("should not be valid", function() {
        this.model.set({
          text: ""
        });
        return chai.expect([this.model.isValid(), this.model.errors]).to.be.deep.equal([false, ["text"]]);
      });
    });
  };

}).call(this);

},{}],29:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("Model", function() {
      require("./model/syncs_spec").apply(this);
      require("./model/store_spec").apply(this);
      require("./model/schemes_spec").apply(this);
      require("./model/mappings_spec").apply(this);
      require("./model/populate_spec").apply(this);
      require("./model/validations_spec").apply(this);
      require("./model/nested_attributes_spec").apply(this);
      require("./model/computed_attributes_spec").apply(this);
      return describe("json", function() {
        var Book, Page, Pages;
        Book = (function(superClass) {
          extend(Book, superClass);

          function Book() {
            return Book.__super__.constructor.apply(this, arguments);
          }

          Book.prototype.mappings = {
            pages: function() {
              return Pages;
            }
          };

          Book.prototype.computedAttributes = {
            full_title: "fullTitle"
          };

          Book.prototype.fullTitle = function() {
            return (this.get("title")) + " by " + (this.get("author"));
          };

          Book.register("Book");

          return Book;

        })(Hipbone.Model);
        Page = (function(superClass) {
          extend(Page, superClass);

          function Page() {
            return Page.__super__.constructor.apply(this, arguments);
          }

          Page.prototype.mappings = {
            book: function() {
              return Book;
            }
          };

          Page.register("Page");

          return Page;

        })(Hipbone.Model);
        Pages = (function(superClass) {
          extend(Pages, superClass);

          function Pages() {
            return Pages.__super__.constructor.apply(this, arguments);
          }

          Pages.prototype.model = Page;

          Pages.register("Pages");

          return Pages;

        })(Hipbone.Collection);
        before(function() {
          Hipbone.Model.identityMap.clear();
          Hipbone.Collection.identityMap.clear();
          return this.book = new Book({
            id: 1,
            title: "Hipbone",
            author: "Mateus",
            pages: [
              {
                book_id: 1
              }, {
                book_id: 1
              }
            ]
          });
        });
        it("should include by default cid and computed attributes", function() {
          return chai.expect(this.book.toJSON()).to.be.deep.equal({
            cid: this.book.cid,
            id: 1,
            title: "Hipbone",
            author: "Mateus",
            full_title: "Hipbone by Mateus"
          });
        });
        it("should behave as backbone when sync", function() {
          return chai.expect(this.book.toJSON({
            sync: true
          })).to.be.deep.equal({
            id: 1,
            title: "Hipbone",
            author: "Mateus"
          });
        });
        return it("should include mappings when requested", function() {
          return chai.expect(this.book.toJSON({
            mappings: {
              pages: {
                mappings: {
                  book: {}
                }
              }
            }
          })).to.be.deep.equal({
            cid: this.book.cid,
            id: 1,
            title: "Hipbone",
            author: "Mateus",
            full_title: "Hipbone by Mateus",
            pages: {
              cid: this.book.get("pages").cid,
              length: 2,
              meta: {
                cid: this.book.get("pages").meta.cid
              },
              models: [
                {
                  book: {
                    cid: this.book.cid,
                    id: 1,
                    title: "Hipbone",
                    author: "Mateus",
                    full_title: "Hipbone by Mateus"
                  },
                  book_id: 1,
                  cid: this.book.get("pages").at(0).cid
                }, {
                  book: {
                    cid: this.book.cid,
                    id: 1,
                    title: "Hipbone",
                    author: "Mateus",
                    full_title: "Hipbone by Mateus"
                  },
                  book_id: 1,
                  cid: this.book.get("pages").at(1).cid
                }
              ]
            }
          });
        });
      });
    });
  };

}).call(this);

},{"./model/computed_attributes_spec":20,"./model/mappings_spec":21,"./model/nested_attributes_spec":22,"./model/populate_spec":23,"./model/schemes_spec":24,"./model/store_spec":25,"./model/syncs_spec":27,"./model/validations_spec":28}],30:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("Module", function() {
      var Animal, Cow, Moo;
      Moo = {
        moo: function() {
          return "mooh";
        }
      };
      Animal = (function(superClass) {
        extend(Animal, superClass);

        function Animal() {
          return Animal.__super__.constructor.apply(this, arguments);
        }

        Animal.register("Animal");

        return Animal;

      })(Hipbone.Module);
      Cow = (function(superClass) {
        extend(Cow, superClass);

        function Cow() {
          return Cow.__super__.constructor.apply(this, arguments);
        }

        Cow.register("Cow");

        return Cow;

      })(Animal);
      it("set module name", function() {
        return chai.expect([Animal.prototype.moduleName, Cow.prototype.moduleName]).to.be.deep.equal(["Animal", "Cow"]);
      });
      it("register subclass", function() {
        return chai.expect([_.contains(Animal.subclasses, Cow), _.keys(Cow.subclasses).length]).to.be.deep.equal([true, 0]);
      });
      it("should include and call included", function() {
        var included;
        included = false;
        Moo.included = function() {
          return included = true;
        };
        Cow.include(Moo);
        return chai.expect([Cow.prototype.moo(), included, _.contains(Cow.includedModules, Moo)]).to.be.deep.equal(["mooh", true, true]);
      });
      return it("should extend and call extended", function() {
        var extended;
        extended = false;
        Moo.extended = function() {
          return extended = true;
        };
        Cow.extend(Moo);
        return chai.expect([Cow.moo(), extended, _.contains(Cow.extendedModules, Moo)]).to.be.deep.equal(["mooh", true, true]);
      });
    });
  };

}).call(this);

},{}],31:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("activate", function() {
      it("should not activate", function() {});
      return it("should activate", function() {});
    });
  };

}).call(this);

},{}],32:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("element", function() {
      it("should append to element", function() {
        var Route, element, elementRoot, route;
        elementRoot = $("<element-root>")[0];
        element = $("<element>")[0];
        Route = (function(superClass) {
          extend(Route, superClass);

          function Route() {
            return Route.__super__.constructor.apply(this, arguments);
          }

          Route.prototype.elementRoot = elementRoot;

          Route.prototype.element = function() {
            return element;
          };

          return Route;

        })(Hipbone.Route);
        route = new Route;
        route.renderElement();
        return chai.expect($(elementRoot).children().first()[0]).to.be.equal(element);
      });
      return it("should set content to view", function() {
        var Route, element, route, view;
        view = new Hipbone.View;
        element = $("<element>")[0];
        Route = (function(superClass) {
          extend(Route, superClass);

          function Route() {
            return Route.__super__.constructor.apply(this, arguments);
          }

          Route.prototype.elementRoot = view.el;

          Route.prototype.element = function() {
            return element;
          };

          return Route;

        })(Hipbone.Route);
        route = new Route;
        route.renderElement();
        return chai.expect(view.$el.children().first()[0]).to.be.equal(element);
      });
    });
  };

}).call(this);

},{}],33:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("parameters", function() {
      it("should initialize params and defaults", function() {
        var Route, route;
        Route = (function(superClass) {
          extend(Route, superClass);

          function Route() {
            return Route.__super__.constructor.apply(this, arguments);
          }

          Route.prototype.defaults = {
            bar: 2
          };

          return Route;

        })(Hipbone.Route);
        route = new Route({
          foo: 1
        });
        return chai.expect([route.params.get("foo"), route.params.get("bar")]).to.be.deep.equal([1, 2]);
      });
      it("should get/set", function() {
        var route;
        route = new Hipbone.Route;
        route.set({
          foo: 123
        });
        route.set("bar", 321);
        return chai.expect([route.get("foo"), route.get("bar")]).to.be.deep.equal([123, 321]);
      });
      it("should listen to events", function() {
        var changed, route;
        changed = false;
        route = new Hipbone.Route;
        route.on("change", (function(_this) {
          return function() {
            return changed = true;
          };
        })(this));
        route.set({
          hello: "world"
        });
        return chai.expect(changed).to.be["true"];
      });
      return it("should parse", function() {
        var Route, route;
        Route = (function(superClass) {
          extend(Route, superClass);

          function Route() {
            return Route.__super__.constructor.apply(this, arguments);
          }

          Route.prototype.parse = function(response) {
            if (response == null) {
              response = {};
            }
            if (response.id) {
              response.id = "_id" + response.id;
            }
            return response;
          };

          return Route;

        })(Hipbone.Route);
        route = new Route({
          id: 123
        });
        return chai.expect(route.get("id")).to.be.deep.equal("_id123");
      });
    });
  };

}).call(this);

},{}],34:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("populate", function() {
      it("should populate", function() {
        var Route, deferred, route;
        deferred = $.Deferred();
        Route = (function(superClass) {
          extend(Route, superClass);

          function Route() {
            return Route.__super__.constructor.apply(this, arguments);
          }

          Route.prototype.populate = function() {
            return deferred.resolve();
          };

          return Route;

        })(Hipbone.Route);
        route = new Route;
        route.prepare();
        return chai.expect(deferred).to.be.fulfilled;
      });
      return it("should not populate", function() {
        var Route, deferred, route;
        deferred = $.Deferred();
        Route = (function(superClass) {
          extend(Route, superClass);

          function Route() {
            return Route.__super__.constructor.apply(this, arguments);
          }

          Route.prototype.populated = function() {
            return true;
          };

          Route.prototype.populate = function() {
            return deferred.resolve();
          };

          return Route;

        })(Hipbone.Route);
        route = new Route;
        route.prepare();
        return chai.expect(deferred).to.not.be.fulfilled;
      });
    });
  };

}).call(this);

},{}],35:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("store", function() {
      it("should be equal with same path and popstate", function() {
        var route;
        route = new Hipbone.Route({}, {
          pathname: "/test"
        });
        return chai.expect(route).to.be.equal(new Hipbone.Route({}, {
          pathname: "/test",
          popstate: true
        }));
      });
      return it("should be different with same path and no popstate", function() {
        var route;
        route = new Hipbone.Route({}, {
          pathname: "/test2"
        });
        return chai.expect(route).to.not.equal(new Hipbone.Route({}, {
          pathname: "/test2",
          popstate: false
        }));
      });
    });
  };

}).call(this);

},{}],36:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("title", function() {
      it("should set root title", function() {
        var route;
        route = new Hipbone.Route({}, {
          titleRoot: "Test"
        });
        return chai.expect(route.title()).to.be.equal("Test");
      });
      return it("should work with subtitle", function() {
        var Route, route;
        Route = (function(superClass) {
          extend(Route, superClass);

          function Route() {
            return Route.__super__.constructor.apply(this, arguments);
          }

          Route.prototype.subtitle = function() {
            return "Foo";
          };

          return Route;

        })(Hipbone.Route);
        route = new Route({}, {
          titleRoot: "Bar"
        });
        return chai.expect(route.title()).to.be.equal("Foo - Bar");
      });
    });
  };

}).call(this);

},{}],37:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Route", function() {
      require("./route/title_spec").apply(this);
      require("./route/store_spec").apply(this);
      require("./route/element_spec").apply(this);
      require("./route/populate_spec").apply(this);
      return require("./route/parameters_spec").apply(this);
    });
  };

}).call(this);

},{"./route/element_spec":32,"./route/parameters_spec":33,"./route/populate_spec":34,"./route/store_spec":35,"./route/title_spec":36}],38:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("matches", function() {
      before(function() {
        this.app = new Hipbone.Application;
        this.app.run();
        return this.app.router.match("/test-*foo", {
          route: Hipbone.Route,
          name: "test",
          url: "/test-:foo"
        });
      });
      it("should get match route url with params", function() {
        return chai.expect(this.app.router.matchUrl("test", {
          foo: "bar",
          test: "ok"
        })).to.be.equal("/test-bar?test=ok");
      });
      return it("should trigger match route with params", function() {
        var BookRoute, route;
        BookRoute = (function(superClass) {
          extend(BookRoute, superClass);

          function BookRoute() {
            return BookRoute.__super__.constructor.apply(this, arguments);
          }

          BookRoute.prototype.element = function() {
            return $("<div>")[0];
          };

          BookRoute.register("BookRoute");

          return BookRoute;

        })(Hipbone.Route);
        this.app.router.match("books/:id", {
          route: BookRoute,
          name: "book",
          url: "books/:id"
        });
        this.app.router.history.loadUrl("/books/1");
        route = this.app.router._route;
        return chai.expect([route instanceof BookRoute, route.get("id")]).to.be.deep.equal([true, 1]);
      });
    });
  };

}).call(this);

},{}],39:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("url", function() {
      before(function() {
        this.app = new Hipbone.Application;
        return this.app.run();
      });
      return it("should parse fragment with params", function() {
        return chai.expect(this.app.router.url("/some/url", {
          foo: "bar"
        })).to.be.equal("/some/url?foo=bar");
      });
    });
  };

}).call(this);

},{}],40:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Router", function() {
      require("./router/url_spec").apply(this);
      return require("./router/matches_spec").apply(this);
    });
  };

}).call(this);

},{"./router/matches_spec":38,"./router/url_spec":39}],41:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Storage", function() {
      var storage;
      storage = new Hipbone.Storage;
      it("should get/set", function() {
        var object;
        object = {
          foo: {
            bar: 123
          }
        };
        storage.set("object", object);
        return chai.expect(storage.get("object")).to.be.deep.equal(object);
      });
      it("should unset", function() {
        storage.unset("object");
        return chai.should(storage.get("object")).not.exist;
      });
      it("should match", function() {
        storage.set("model123", {
          id: 1
        });
        storage.set("view123", {
          id: 2
        });
        storage.set("collection123", {
          id: 3
        });
        return chai.expect(storage.match(/model/)).to.be.deep.equal({
          "model123": {
            id: 1
          }
        });
      });
      return it("should clear", function() {
        var regex;
        regex = new RegExp(storage.prefix);
        storage.clear();
        return chai.expect(_.keys(storage.match(regex)).length).to.be.equal(0);
      });
    });
  };

}).call(this);

},{}],42:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("attributes", function() {
      it("should be dasherized", function() {
        var view;
        view = new Hipbone.View({
          fooBar: "bar"
        });
        return chai.expect(view.$el.attr("foo-bar")).to.be.equal("bar");
      });
      it("should add if class attribute", function() {
        var View, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.className = "test";

          return View;

        })(Hipbone.View);
        view = new View({
          "class": "test-class"
        });
        return chai.expect(view.$el.attr("class")).to.be.equal("test test-class");
      });
      it("should not set boolean attribute if false", function() {
        var View, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.defaults = {
            test: false
          };

          View.register("View");

          return View;

        })(Hipbone.View);
        view = new View;
        return chai.expect(view.$el.attr("test")).to.be.equal(void 0);
      });
      it("should set boolean attribute empty if true", function() {
        var View, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.defaults = {
            test: false
          };

          View.register("View");

          return View;

        })(Hipbone.View);
        view = new View({
          test: true
        });
        return chai.expect(view.$el.attr("test")).to.be.equal("");
      });
      return it("should not set object attribute", function() {
        var view;
        view = new Hipbone.View({
          object: {}
        });
        return chai.expect(view.$el.attr("object")).to.be.equal(void 0);
      });
    });
  };

}).call(this);

},{}],43:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("bubble", function() {
      return it("should trigger and bubble DOM tree", function() {
        var bubble, element, trigger, view;
        bubble = trigger = false;
        view = new Hipbone.View;
        element = $("<element>");
        element.append(view.el);
        element.on("didBubble", function() {
          return bubble = true;
        });
        view.on("didBubble", function() {
          return trigger = true;
        });
        view.bubble("didBubble");
        return chai.expect([bubble, trigger]).to.be.deep.equal([true, true]);
      });
    });
  };

}).call(this);

},{}],44:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("class name bindings", function() {
      return it("should update bindings", function(done) {
        var View, beforeUpdate, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.classNameBindings = {
            "foo": function() {
              return this.get("foo") !== "bar";
            },
            "foo-bar": function() {
              return this.get("foo") === "bar";
            }
          };

          return View;

        })(Hipbone.View);
        view = new View({
          foo: ""
        });
        beforeUpdate = view.$el.attr("class");
        view.set({
          foo: "bar"
        });
        return _.defer(function() {
          var afterUpdate;
          afterUpdate = view.$el.attr("class");
          chai.expect([beforeUpdate, afterUpdate]).to.be.deep.equal(["foo", "foo-bar"]);
          return done();
        });
      });
    });
  };

}).call(this);

},{}],45:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("content", function() {
      it("should append content to element", function() {
        var element, view;
        element = $("<element>")[0];
        view = new Hipbone.View;
        view.setContent(element);
        return chai.expect(view.$el.children().last()[0]).to.be.equal(element);
      });
      return it("should append content to container", function() {
        var View, element, view;
        element = $("<element>")[0];
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.container = "#container";

          View.prototype.templateName = "view";

          View.prototype.templates = {
            view: Handlebars.compile("<div id='container'></div>")
          };

          return View;

        })(Hipbone.View);
        view = new View;
        view.setContent(element);
        return chai.expect(view.$("#container").children().first()[0]).to.be.equal(element);
      });
    });
  };

}).call(this);

},{}],46:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("context", function() {
      it("should present context", function() {
        var collection, model, view;
        model = new Hipbone.Model({
          text: "test"
        });
        collection = new Hipbone.Collection([model]);
        view = new Hipbone.View({
          model: model,
          collection: collection,
          foo: "bar"
        });
        view.context = function() {
          return {
            fooUpcase: this.get("foo").toUpperCase()
          };
        };
        return chai.expect(view.presentContext(view.context())).to.be.deep.equal({
          view: view,
          collection: {
            cid: collection.cid,
            length: 1,
            meta: {
              cid: collection.meta.cid
            },
            models: [
              {
                cid: model.cid,
                text: "test"
              }
            ]
          },
          foo: "bar",
          fooUpcase: "BAR",
          loading: false,
          model: {
            cid: model.cid,
            text: "test"
          }
        });
      });
      return it("should merge context", function() {
        var object, object2, view;
        object = {
          one: {
            two: {
              three: 123
            }
          }
        };
        object2 = {
          one: {
            two: {
              three: 321
            }
          }
        };
        view = new Hipbone.View({
          object: object
        });
        view.mergeContext({
          object: object2
        });
        return chai.expect(view._context.object).to.be.equal(object);
      });
    });
  };

}).call(this);

},{}],47:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("elements", function() {
      it("should register element", function() {
        var ElementView;
        ElementView = (function(superClass) {
          extend(ElementView, superClass);

          function ElementView() {
            return ElementView.__super__.constructor.apply(this, arguments);
          }

          ElementView.prototype.defaults = {
            foo: "",
            bar: false
          };

          ElementView.register("ElementView");

          return ElementView;

        })(Hipbone.View);
        return chai.expect([ElementView.prototype.elementName, ElementView.prototype.booleans]).to.be.deep.equal(["element", ["bar"]]);
      });
      it("should have hipboneView assigned", function() {
        var view;
        view = new Hipbone.View;
        return chai.expect(view.el.hipboneView).to.be.equal(view);
      });
      it("should get selector", function() {
        var View, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.elements = {
            foo: ".bar"
          };

          return View;

        })(Hipbone.View);
        view = new View;
        return chai.expect([view.getSelector(".foo"), view.getSelector("foo")]).to.be.deep.equal([".foo", ".bar"]);
      });
      return it("should get $view", function() {
        var View, barView, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.elements = {
            foo: ".bar"
          };

          return View;

        })(Hipbone.View);
        view = new View;
        barView = new Hipbone.View({
          "class": "bar"
        });
        view.$el.append(barView.el);
        return chai.expect(view.$view("foo")).to.be.equal(barView);
      });
    });
  };

}).call(this);

},{}],48:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("lifecycle", function() {
      it("should insert", function(done) {
        var inserted, view;
        inserted = false;
        view = new Hipbone.View;
        view.on("insert", function() {
          return inserted = true;
        });
        view.$el.appendTo("#fixtures");
        return _.defer(function() {
          chai.expect(inserted).to.be["true"];
          return done();
        });
      });
      it("should detach", function(done) {
        var detached, view;
        detached = false;
        view = new Hipbone.View;
        view.on("detach", function() {
          return detached = true;
        });
        view.$el.appendTo("#fixtures");
        view.$el.remove();
        return _.defer(function() {
          chai.expect(detached).to.be["true"];
          return done();
        });
      });
      it("should change", function(done) {
        var changed, view;
        changed = false;
        view = new Hipbone.View;
        view.on("change", function() {
          return changed = true;
        });
        view.$el.appendTo("#fixtures");
        view.$el.attr("foo", "bar");
        return _.defer(function() {
          chai.expect(changed).to.be["true"];
          return done();
        });
      });
      it("should change props", function(done) {
        var View, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.defaults = {
            fooBar: false
          };

          View.register("View");

          return View;

        })(Hipbone.View);
        view = new View;
        view.$el.appendTo("#fixtures");
        view.$el.attr("foo-bar", "");
        return _.defer(function() {
          chai.expect(view.get("fooBar")).to.be["true"];
          return done();
        });
      });
      return it("should not change internal props", function(done) {
        var View, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.internals = ["foo"];

          View.prototype.defaults = {
            fooBar: false
          };

          View.register("View");

          return View;

        })(Hipbone.View);
        view = new View;
        view.$el.appendTo("#fixtures");
        view.$el.on("change", function() {
          return console.log(arguments);
        });
        view.$el.attr("foo-bar", "");
        return _.defer(function() {
          chai.expect(view.get("fooBar")).to.be["true"];
          return done();
        });
      });
    });
  };

}).call(this);

},{}],49:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("populate", function() {
      it("should populate", function() {
        var View, deferred, view;
        deferred = $.Deferred();
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.populate = function() {
            return deferred.resolve();
          };

          return View;

        })(Hipbone.View);
        view = new View;
        view.prepare();
        return chai.expect(deferred).to.be.fulfilled;
      });
      it("should not populate", function() {
        var View, deferred, view;
        deferred = $.Deferred();
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.populate = function() {
            return deferred.resolve();
          };

          return View;

        })(Hipbone.View);
        view = new View;
        deferred.resolve();
        view.prepare();
        return chai.expect(deferred).to.be.fulfilled;
      });
      it("should show loading when populating", function() {
        var View, afterPopulate, beforePopulate, deferred, view;
        deferred = $.Deferred();
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.populated = function() {
            return deferred.state() === "resolved";
          };

          View.prototype.populate = function() {
            return deferred;
          };

          return View;

        })(Hipbone.View);
        view = new View;
        view.prepare();
        beforePopulate = view.get("loading");
        deferred.resolve();
        afterPopulate = view.get("loading");
        return chai.expect([beforePopulate, afterPopulate]).to.be.deep.equal([true, false]);
      });
      return it("should not show loading when background populating", function() {
        var View, afterPopulate, beforePopulate, deferred, view;
        deferred = $.Deferred();
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.background = true;

          View.prototype.populated = function() {
            return true;
          };

          View.prototype.populate = function() {
            return deferred;
          };

          return View;

        })(Hipbone.View);
        view = new View;
        view.prepare();
        beforePopulate = view.get("loading");
        deferred.resolve();
        afterPopulate = view.get("loading");
        return chai.expect([beforePopulate, afterPopulate]).to.be.deep.equal([false, false]);
      });
    });
  };

}).call(this);

},{}],50:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("properties", function() {
      it("should initialize properties, internals and defaults", function() {
        var View, view;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          View.prototype.internals = ["fooBar"];

          View.prototype.defaults = {
            bar: 2
          };

          return View;

        })(Hipbone.View);
        view = new View({
          foo: 1,
          fooBar: 1
        });
        return chai.expect([view.props.get("foo"), view.props.get("bar"), view.props.get("fooBar")]).to.be.deep.equal([1, 2, void 0]);
      });
      it("should get/set props", function() {
        var view;
        view = new Hipbone.View;
        view.set({
          foo: 123
        });
        view.set("bar", 321);
        return chai.expect([view.get("foo"), view.get("bar")]).to.be.deep.equal([123, 321]);
      });
      return it("should listen to events", function() {
        var changed, view;
        changed = false;
        view = new Hipbone.View;
        view.on("change", (function(_this) {
          return function() {
            return changed = true;
          };
        })(this));
        view.set({
          hello: "world"
        });
        return chai.expect(changed).to.be["true"];
      });
    });
  };

}).call(this);

},{}],51:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("store", function() {
      return it("should be different", function() {
        var view;
        view = new Hipbone.View;
        return chai.expect(view).to.not.be.equal(new Hipbone.View);
      });
    });
  };

}).call(this);

},{}],52:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("template", function() {});
  };

}).call(this);

},{}],53:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("View", function() {
      require("./view/bubble_spec").apply(this);
      require("./view/content_spec").apply(this);
      require("./view/context_spec").apply(this);
      require("./view/populate_spec").apply(this);
      require("./view/elements_spec").apply(this);
      require("./view/template_spec").apply(this);
      require("./view/lifecycle_spec").apply(this);
      require("./view/properties_spec").apply(this);
      return require("./view/class_name_bindings_spec").apply(this);
    });
  };

}).call(this);

},{"./view/bubble_spec":43,"./view/class_name_bindings_spec":44,"./view/content_spec":45,"./view/context_spec":46,"./view/elements_spec":47,"./view/lifecycle_spec":48,"./view/populate_spec":49,"./view/properties_spec":50,"./view/template_spec":52}],54:[function(require,module,exports){
(function() {
  if (navigator.userAgent.indexOf('PhantomJS') < 0) {
    describe("hipbone", function() {
      require("./hipbone/module_spec").apply(this);
      require("./hipbone/i18n_spec").apply(this);
      require("./hipbone/identity_map_spec").apply(this);
      require("./hipbone/storage_spec").apply(this);
      require("./hipbone/application_spec").apply(this);
      require("./hipbone/model_spec").apply(this);
      require("./hipbone/collection_spec").apply(this);
      require("./hipbone/router_spec").apply(this);
      require("./hipbone/route_spec").apply(this);
      return require("./hipbone/view_spec").apply(this);
    });
  }

}).call(this);

},{"./hipbone/application_spec":8,"./hipbone/collection_spec":17,"./hipbone/i18n_spec":18,"./hipbone/identity_map_spec":19,"./hipbone/model_spec":29,"./hipbone/module_spec":30,"./hipbone/route_spec":37,"./hipbone/router_spec":40,"./hipbone/storage_spec":41,"./hipbone/view_spec":53}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54]);
