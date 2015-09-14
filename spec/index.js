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


}).call(this);

},{}],2:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("ajax", function() {
      it("should prepend url with host", function() {
        var app;
        app = new Hipbone.Application({
          host: "/api/v1"
        });
        return chai.expect(app.ajaxUrl("/ping")).to.be.equal("/api/v1/ping");
      });
      return it("should add headers", function() {
        var app;
        app = new Hipbone.Application({
          headers: {
            "X-CSRF-Token": "abcdefg",
            "X-Auth-Token": function() {
              return this.authToken;
            }
          }
        });
        app.authToken = 123;
        return chai.expect(app.ajaxHeaders()).to.be.deep.equal({
          "X-Auth-Token": 123,
          "X-CSRF-Token": "abcdefg"
        });
      });
    });
  };

}).call(this);

},{}],3:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("collections", function() {
      it("should store collections inside app scope as default", function() {
        var App, app;
        App = (function(superClass) {
          extend(App, superClass);

          function App() {
            return App.__super__.constructor.apply(this, arguments);
          }

          return App;

        })(Hipbone.Application);
        App.Collection = (function(superClass) {
          extend(Collection, superClass);

          function Collection() {
            return Collection.__super__.constructor.apply(this, arguments);
          }

          return Collection;

        })(Hipbone.Collection);
        app = new App;
        return chai.expect(app.collections.Collection).to.be.equal(App.Collection);
      });
      return it("should store specified collections", function() {
        var Collection, app;
        Collection = (function(superClass) {
          extend(Collection, superClass);

          function Collection() {
            return Collection.__super__.constructor.apply(this, arguments);
          }

          return Collection;

        })(Hipbone.Collection);
        app = new Hipbone.Application({
          collections: {
            Collection: Collection
          }
        });
        return chai.expect(app.collections.Collection).to.be.deep.equal(Collection);
      });
    });
  };

}).call(this);

},{}],4:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("link bridge", function() {
      return it("TODO", function() {});
    });
  };

}).call(this);

},{}],5:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("parse body", function() {
      it("should parse view elements", function() {
        var OtherView, app, initialized;
        $("#fixtures").append("<hb-other></hb-other>");
        initialized = false;
        OtherView = (function(superClass) {
          extend(OtherView, superClass);

          function OtherView() {
            return OtherView.__super__.constructor.apply(this, arguments);
          }

          OtherView.prototype.initialize = function() {
            return initialized = true;
          };

          return OtherView;

        })(Hipbone.View);
        app = new Hipbone.Application({
          views: {
            OtherView: OtherView
          }
        });
        app.run();
        return chai.expect(initialized).to.be["true"];
      });
      return it("should detect application view", function() {
        var ApplicationView, app, appView;
        $("#fixtures").append("<hb-application></hb-application>");
        appView = null;
        ApplicationView = (function(superClass) {
          extend(ApplicationView, superClass);

          function ApplicationView() {
            return ApplicationView.__super__.constructor.apply(this, arguments);
          }

          ApplicationView.prototype.initialize = function() {
            return appView = this;
          };

          return ApplicationView;

        })(Hipbone.View);
        app = new Hipbone.Application({
          views: {
            ApplicationView: ApplicationView
          }
        });
        app.run();
        return chai.expect(app.appView).to.be.equal(appView);
      });
    });
  };

}).call(this);

},{}],6:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("parse model", function() {
      it("should parse Model json", function() {
        var app, model;
        app = new Hipbone.Application;
        model = new Hipbone.Model;
        return chai.expect(Handlebars.parseValue(Handlebars.compile("{{model}}")({
          model: model.toJSON()
        }))).to.be.equal(model);
      });
      return it("should parse Collection json", function() {
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

},{}],7:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("prevent form", function() {
      return it("TODO", function() {});
    });
  };

}).call(this);

},{}],8:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("register elements", function() {
      return it("should register views", function() {
        var TestView, app;
        TestView = (function(superClass) {
          extend(TestView, superClass);

          function TestView() {
            return TestView.__super__.constructor.apply(this, arguments);
          }

          return TestView;

        })(Hipbone.View);
        app = new Hipbone.Application({
          views: {
            TestView: TestView
          }
        });
        return chai.should(Handlebars.elements.test).exist;
      });
    });
  };

}).call(this);

},{}],9:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("register helpers", function() {
      it("should get asset path", function() {
        var app;
        app = new Hipbone.Application({
          state: {
            assets: {
              foo: "bar"
            }
          }
        });
        return chai.expect(Handlebars.compile("{{asset 'foo'}}")()).to.be.equal("bar");
      });
      it("should translate key", function() {
        var app;
        app = new Hipbone.Application({
          locales: {
            en: {
              foo: {
                other: "{{count}} bars"
              }
            }
          }
        });
        return chai.expect(Handlebars.compile("{{t 'foo' count=3}}")()).to.be.equal("3 bars");
      });
      it("should route url", function() {
        var TestRoute, app;
        TestRoute = (function(superClass) {
          extend(TestRoute, superClass);

          function TestRoute() {
            return TestRoute.__super__.constructor.apply(this, arguments);
          }

          TestRoute.prototype.url = "test";

          TestRoute.prototype.toURL = function() {
            return "/test";
          };

          return TestRoute;

        })(Hipbone.Route);
        app = new Hipbone.Application({
          routes: {
            TestRoute: TestRoute
          }
        });
        app.run();
        app.router.match("test");
        return chai.expect(Handlebars.compile("{{url 'test'}}")()).to.be.equal("/test");
      });
      it("should format string", function() {
        return chai.expect(Handlebars.compile("{{fmt '%@' 123}}")()).to.be.equal("123");
      });
      it("should eval expression", function() {
        return chai.expect(Handlebars.compile("{{eval '1 + 1'}}")()).to.be.equal("2");
      });
      it("#each should work with collection", function() {
        var collection;
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
        var collection;
        collection = new Hipbone.Collection([]);
        return chai.expect(Handlebars.compile("{{#if collection}}coco{{/if}}")({
          collection: collection.toJSON()
        })).to.be.equal("");
      });
    });
  };

}).call(this);

},{}],10:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("register modules", function() {
      return it("should register", function() {
        var Test, app, test;
        Test = (function(superClass) {
          extend(Test, superClass);

          function Test() {
            return Test.__super__.constructor.apply(this, arguments);
          }

          return Test;

        })(Hipbone.Model);
        app = new Hipbone.Application({
          models: {
            Test: Test
          }
        });
        test = new Test;
        return chai.expect(test.moduleName).to.be.equal("Test");
      });
    });
  };

}).call(this);

},{}],11:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("start history", function() {
      return it("should start history", function() {
        var app;
        app = new Hipbone.Application;
        app.run();
        return chai.expect(Backbone.History.started).to.be["true"];
      });
    });
  };

}).call(this);

},{}],12:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("sync", function() {
      return it("should extend ajax settings", function() {
        var model, settings;
        model = new Hipbone.Model({
          id: 1
        });
        model.urlRoot = "/model";
        settings = Backbone.sync("read", model).settings;
        return chai.expect([settings.url, settings.sync]).to.be.deep.equal(["/api/v1/model/1", true]);
      });
    });
  };

}).call(this);

},{}],13:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("initializers", function() {
      it("should extend and run initializers with options as default", function() {
        var App, app, initializer;
        App = (function(superClass) {
          extend(App, superClass);

          function App() {
            return App.__super__.constructor.apply(this, arguments);
          }

          App.prototype.output = [];

          App.prototype.initializers = [
            function() {
              return this.output.push("foo");
            }
          ];

          return App;

        })(Hipbone.Application);
        initializer = function(options) {
          if (options == null) {
            options = {};
          }
          if (options.bar) {
            return this.output.push("bar");
          }
        };
        app = new App({
          bar: true,
          initializers: [initializer]
        });
        return chai.expect(app.output).to.be.deep.equal(["foo", "bar"]);
      });
      require("./initializers/sync_spec").apply(this);
      require("./initializers/register_modules_spec").apply(this);
      require("./initializers/register_elements_spec").apply(this);
      require("./initializers/register_helpers_spec").apply(this);
      require("./initializers/parse_body_spec").apply(this);
      require("./initializers/parse_model_spec").apply(this);
      require("./initializers/link_bridge_spec").apply(this);
      require("./initializers/prevent_form_spec").apply(this);
      return require("./initializers/start_history_spec").apply(this);
    });
  };

}).call(this);

},{"./initializers/link_bridge_spec":4,"./initializers/parse_body_spec":5,"./initializers/parse_model_spec":6,"./initializers/prevent_form_spec":7,"./initializers/register_elements_spec":8,"./initializers/register_helpers_spec":9,"./initializers/register_modules_spec":10,"./initializers/start_history_spec":11,"./initializers/sync_spec":12}],14:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("locales", function() {
      it("should initialize i18n with english locale as default", function() {
        var app;
        app = new Hipbone.Application({
          locales: {
            en: {
              hello: "Hello"
            }
          }
        });
        return chai.expect(app.i18n.translate("hello")).to.be.equal("Hello");
      });
      return it("should initialize i18n with specified locale", function() {
        var app;
        app = new Hipbone.Application({
          locale: "pt-BR",
          locales: {
            "pt-BR": {
              hello: "Olá"
            }
          }
        });
        return chai.expect(app.i18n.translate("hello")).to.be.equal("Olá");
      });
    });
  };

}).call(this);

},{}],15:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("models", function() {
      it("should store models inside app scope as default", function() {
        var App, app;
        App = (function(superClass) {
          extend(App, superClass);

          function App() {
            return App.__super__.constructor.apply(this, arguments);
          }

          return App;

        })(Hipbone.Application);
        App.Model = (function(superClass) {
          extend(Model, superClass);

          function Model() {
            return Model.__super__.constructor.apply(this, arguments);
          }

          return Model;

        })(Hipbone.Model);
        app = new App;
        return chai.expect(app.models.Model).to.be.equal(App.Model);
      });
      return it("should store specified models", function() {
        var Model, app;
        Model = (function(superClass) {
          extend(Model, superClass);

          function Model() {
            return Model.__super__.constructor.apply(this, arguments);
          }

          return Model;

        })(Hipbone.Model);
        app = new Hipbone.Application({
          models: {
            Model: Model
          }
        });
        return chai.expect(app.models.Model).to.be.deep.equal(Model);
      });
    });
  };

}).call(this);

},{}],16:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("routes", function() {
      it("should store routes inside app scope as default", function() {
        var App, app;
        App = (function(superClass) {
          extend(App, superClass);

          function App() {
            return App.__super__.constructor.apply(this, arguments);
          }

          return App;

        })(Hipbone.Application);
        App.Route = (function(superClass) {
          extend(Route, superClass);

          function Route() {
            return Route.__super__.constructor.apply(this, arguments);
          }

          return Route;

        })(Hipbone.Route);
        app = new App;
        return chai.expect(app.routes.Route).to.be.equal(App.Route);
      });
      return it("should store specified routes", function() {
        var Route, app;
        Route = (function(superClass) {
          extend(Route, superClass);

          function Route() {
            return Route.__super__.constructor.apply(this, arguments);
          }

          return Route;

        })(Hipbone.Route);
        app = new Hipbone.Application({
          routes: {
            Route: Route
          }
        });
        return chai.expect(app.routes.Route).to.be.deep.equal(Route);
      });
    });
  };

}).call(this);

},{}],17:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("state", function() {
      it("should initialize state and defaults", function() {
        var app;
        app = new Hipbone.Application({
          defaults: {
            bar: 2
          },
          state: {
            foo: 1
          }
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

},{}],18:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("templates", function() {
      return it("should initialize templates and get template from path", function() {
        var app;
        app = new Hipbone.Application({
          templatePath: "root_path/",
          templates: {
            "root_path/path/to/foo": Handlebars.compile("foo")
          }
        });
        return chai.expect(app.getTemplate("path/to/foo")()).to.be.deep.equal("foo");
      });
    });
  };

}).call(this);

},{}],19:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("views", function() {
      it("should store views inside app scope as default", function() {
        var App, app;
        App = (function(superClass) {
          extend(App, superClass);

          function App() {
            return App.__super__.constructor.apply(this, arguments);
          }

          return App;

        })(Hipbone.Application);
        App.View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          return View;

        })(Hipbone.View);
        app = new App;
        return chai.expect(app.views.View).to.be.equal(App.View);
      });
      return it("should store specified views", function() {
        var View, app;
        View = (function(superClass) {
          extend(View, superClass);

          function View() {
            return View.__super__.constructor.apply(this, arguments);
          }

          return View;

        })(Hipbone.View);
        app = new Hipbone.Application({
          views: {
            View: View
          }
        });
        return chai.expect(app.views.View).to.be.deep.equal(View);
      });
    });
  };

}).call(this);

},{}],20:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Application", function() {
      require("./application/ajax_spec").apply(this);
      require("./application/models_spec").apply(this);
      require("./application/routes_spec").apply(this);
      require("./application/views_spec").apply(this);
      require("./application/templates_spec").apply(this);
      require("./application/collections_spec").apply(this);
      require("./application/state_spec").apply(this);
      require("./application/locales_spec").apply(this);
      return require("./application/initializers_spec").apply(this);
    });
  };

}).call(this);

},{"./application/ajax_spec":2,"./application/collections_spec":3,"./application/initializers_spec":13,"./application/locales_spec":14,"./application/models_spec":15,"./application/routes_spec":16,"./application/state_spec":17,"./application/templates_spec":18,"./application/views_spec":19}],21:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("dynamic model", function() {
      var Annotations, AuthorAnnotation, ReaderAnnotation;
      ReaderAnnotation = (function(superClass) {
        extend(ReaderAnnotation, superClass);

        function ReaderAnnotation() {
          return ReaderAnnotation.__super__.constructor.apply(this, arguments);
        }

        return ReaderAnnotation;

      })(Hipbone.Model);
      AuthorAnnotation = (function(superClass) {
        extend(AuthorAnnotation, superClass);

        function AuthorAnnotation() {
          return AuthorAnnotation.__super__.constructor.apply(this, arguments);
        }

        return AuthorAnnotation;

      })(Hipbone.Model);
      Annotations = (function(superClass) {
        extend(Annotations, superClass);

        function Annotations() {
          return Annotations.__super__.constructor.apply(this, arguments);
        }

        return Annotations;

      })(Hipbone.Collection);
      before(function() {
        return this.app = new Hipbone.Application({
          models: {
            ReaderAnnotation: ReaderAnnotation,
            AuthorAnnotation: AuthorAnnotation
          },
          collections: {
            Annotations: Annotations
          }
        });
      });
      return it("should set model", function() {
        var annotation1, annotation2, annotations;
        annotation1 = new AuthorAnnotation({
          id: 1
        });
        annotation2 = new ReaderAnnotation({
          id: 1
        });
        annotations = new Annotations([annotation1, annotation2]);
        console.log(window.annotations = annotations);
        return chai.expect(annotations.map(function(annotation) {
          return annotation.id;
        })).to.be.deep.equal([1, 1]);
      });
    });
  };

}).call(this);

},{}],22:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("filters", function() {
      var ReaderAnnotation, ReaderAnnotations;
      ReaderAnnotation = (function(superClass) {
        extend(ReaderAnnotation, superClass);

        function ReaderAnnotation() {
          return ReaderAnnotation.__super__.constructor.apply(this, arguments);
        }

        return ReaderAnnotation;

      })(Hipbone.Model);
      ReaderAnnotations = (function(superClass) {
        extend(ReaderAnnotations, superClass);

        function ReaderAnnotations() {
          return ReaderAnnotations.__super__.constructor.apply(this, arguments);
        }

        ReaderAnnotations.prototype.model = ReaderAnnotation;

        ReaderAnnotations.prototype.urlRoot = "/annotations";

        ReaderAnnotations.prototype.filters = {
          reader: true
        };

        return ReaderAnnotations;

      })(Hipbone.Collection);
      return it("should be in query url params", function() {
        var readerAnnotations;
        readerAnnotations = new ReaderAnnotations;
        return chai.expect(readerAnnotations.url()).to.be.equal("/annotations?reader=true");
      });
    });
  };

}).call(this);

},{}],23:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("meta", function() {
      it("should initialize meta and defaults", function() {
        var collection;
        collection = new Hipbone.Collection([], {
          defaults: {
            max: 50
          },
          meta: {
            count: 10
          }
        });
        return chai.expect([collection.meta.get("count"), collection.meta.get("max")]).to.be.deep.equal([10, 50]);
      });
      return it("should listen to events", function() {
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
    });
  };

}).call(this);

},{}],24:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("pagination", function() {
      var ReaderAnnotation, ReaderAnnotations;
      ReaderAnnotation = (function(superClass) {
        extend(ReaderAnnotation, superClass);

        function ReaderAnnotation() {
          return ReaderAnnotation.__super__.constructor.apply(this, arguments);
        }

        return ReaderAnnotation;

      })(Hipbone.Model);
      ReaderAnnotations = (function(superClass) {
        extend(ReaderAnnotations, superClass);

        function ReaderAnnotations() {
          return ReaderAnnotations.__super__.constructor.apply(this, arguments);
        }

        ReaderAnnotations.prototype.urlRoot = "/annotations";

        ReaderAnnotations.prototype.pagination = {
          offset: 0,
          limit: 10
        };

        return ReaderAnnotations;

      })(Hipbone.Collection);
      before(function() {
        return this.readerAnnotations = new ReaderAnnotations;
      });
      it("should increment pagination", function() {
        this.readerAnnotations.incrementPagination();
        return chai.expect(this.readerAnnotations.url({
          paginate: true
        })).to.be.equal("/annotations?limit=10&offset=10");
      });
      it("should decrement pagination", function() {
        this.readerAnnotations.decrementPagination();
        return chai.expect(this.readerAnnotations.url({
          paginate: true
        })).to.be.equal("/annotations?limit=10&offset=0");
      });
      return it("should fetch only models since beginning", function() {
        this.readerAnnotations.incrementPagination();
        this.readerAnnotations.incrementPagination();
        return chai.expect(this.readerAnnotations.url()).to.be.equal("/annotations?limit=30&offset=0");
      });
    });
  };

}).call(this);

},{}],25:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("parent", function() {
      var Annotation, Annotations, Page;
      Page = (function(superClass) {
        extend(Page, superClass);

        function Page() {
          return Page.__super__.constructor.apply(this, arguments);
        }

        Page.prototype.urlRoot = "/pages";

        return Page;

      })(Hipbone.Model);
      Annotation = (function(superClass) {
        extend(Annotation, superClass);

        function Annotation() {
          return Annotation.__super__.constructor.apply(this, arguments);
        }

        return Annotation;

      })(Hipbone.Model);
      Annotations = (function(superClass) {
        extend(Annotations, superClass);

        function Annotations() {
          return Annotations.__super__.constructor.apply(this, arguments);
        }

        Annotations.prototype.model = Annotation;

        Annotations.prototype.urlRoot = "/annotations";

        return Annotations;

      })(Hipbone.Collection);
      before(function() {
        this.page = new Page({
          id: 1
        });
        return this.annotations = new Annotations([], {
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
  };

}).call(this);

},{}],26:[function(require,module,exports){
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

        return ReaderAnnotation;

      })(Hipbone.Model);
      AuthorAnnotation = (function(superClass) {
        extend(AuthorAnnotation, superClass);

        function AuthorAnnotation() {
          return AuthorAnnotation.__super__.constructor.apply(this, arguments);
        }

        return AuthorAnnotation;

      })(Hipbone.Model);
      Annotations = (function(superClass) {
        extend(Annotations, superClass);

        function Annotations() {
          return Annotations.__super__.constructor.apply(this, arguments);
        }

        Annotations.prototype.model = [ReaderAnnotation, AuthorAnnotation];

        return Annotations;

      })(Hipbone.Collection);
      before(function() {
        return this.app = new Hipbone.Application({
          models: {
            ReaderAnnotation: ReaderAnnotation,
            AuthorAnnotation: AuthorAnnotation
          },
          collections: {
            Annotations: Annotations
          }
        });
      });
      it("should set model", function() {
        var annotation1, annotation2, annotations;
        annotation1 = new AuthorAnnotation({
          id: 1
        });
        annotation2 = new ReaderAnnotation({
          id: 1
        });
        annotations = new Annotations([annotation1, annotation2]);
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
        annotations = new Annotations([annotation1, annotation2]);
        return chai.expect(annotations.map(function(annotation) {
          return annotation.id;
        })).to.be.deep.equal([1, 1]);
      });
    });
  };

}).call(this);

},{}],27:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("populate", function() {
      it("should populate", function() {
        var collection;
        collection = new Hipbone.Collection;
        collection.urlRoot = "/populate";
        return chai.expect(collection.prepare().state()).to.be.equal("rejected");
      });
      return it("should not populate", function() {
        var collection;
        collection = new Hipbone.Collection;
        collection.didSync();
        return chai.expect(collection.prepare().state()).to.be.equal("resolved");
      });
    });
  };

}).call(this);

},{}],28:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("store", function() {
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
  };

}).call(this);

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

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
        var Page, Pages;
        Page = (function(superClass) {
          extend(Page, superClass);

          function Page() {
            return Page.__super__.constructor.apply(this, arguments);
          }

          return Page;

        })(Hipbone.Model);
        Pages = (function(superClass) {
          extend(Pages, superClass);

          function Pages() {
            return Pages.__super__.constructor.apply(this, arguments);
          }

          Pages.prototype.model = Page;

          return Pages;

        })(Hipbone.Collection);
        before(function() {
          return this.pages = new Pages([
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
          return chai.expect(this.pages.toJSON()).to.be.deep.equal({
            cid: this.pages.cid,
            length: 2,
            meta: {
              cid: this.pages.meta.cid,
              count: 10
            },
            models: [
              {
                cid: this.pages.at(0).cid,
                id: 1
              }, {
                cid: this.pages.at(1).cid,
                id: 2
              }
            ]
          });
        });
        return it("should behave as backbone when sync", function() {
          return chai.expect(this.pages.toJSON({
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

},{"./collection/filters_spec":22,"./collection/meta_spec":23,"./collection/pagination_spec":24,"./collection/parent_spec":25,"./collection/polymorphic_spec":26,"./collection/populate_spec":27,"./collection/store_spec":28,"./collection/sync_spec":29}],31:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("History", function() {
      return it("TODO", function() {});
    });
  };

}).call(this);

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("computed attributes", function() {
      var Book;
      Book = (function(superClass) {
        extend(Book, superClass);

        function Book() {
          return Book.__super__.constructor.apply(this, arguments);
        }

        Book.prototype.defaults = {
          title: "Untitled",
          author: "Unknown"
        };

        Book.prototype.computedAttributes = {
          full_title: "fullTitle"
        };

        Book.prototype.fullTitle = function() {
          return (this.get("title")) + " by " + (this.get("author"));
        };

        return Book;

      })(Hipbone.Model);
      return it("should get attribute", function() {
        var book;
        book = new Book({
          title: "Hipbone",
          author: "Mateus"
        });
        return chai.expect(book.get("full_title")).to.be.equal("Hipbone by Mateus");
      });
    });
  };

}).call(this);

},{}],35:[function(require,module,exports){
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
          pages: "Pages"
        };

        return Book;

      })(Hipbone.Model);
      Page = (function(superClass) {
        extend(Page, superClass);

        function Page() {
          return Page.__super__.constructor.apply(this, arguments);
        }

        Page.prototype.mappings = {
          book: "Book",
          top_annotation: ["ReaderAnnotation"]
        };

        return Page;

      })(Hipbone.Model);
      Pages = (function(superClass) {
        extend(Pages, superClass);

        function Pages() {
          return Pages.__super__.constructor.apply(this, arguments);
        }

        Pages.prototype.model = Page;

        return Pages;

      })(Hipbone.Collection);
      ReaderAnnotation = (function(superClass) {
        extend(ReaderAnnotation, superClass);

        function ReaderAnnotation() {
          return ReaderAnnotation.__super__.constructor.apply(this, arguments);
        }

        return ReaderAnnotation;

      })(Hipbone.Model);
      describe("model", function() {
        before(function() {
          return this.app = new Hipbone.Application({
            models: {
              Book: Book,
              Page: Page,
              ReaderAnnotation: ReaderAnnotation
            },
            collections: {
              Pages: Pages
            }
          });
        });
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
          return chai.expect(page.get("book")).to.equal(book);
        });
        it("should map for transient", function() {
          var book, page;
          book = new Book;
          page = new Page({
            book: book
          });
          return chai.expect(page.get("book")).to.equal(book);
        });
        return it("should parse object", function() {
          var page;
          page = new Page({
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
          return chai.expect(page.get("top_annotation")).to.equal(annotation);
        });
        it("should map for transient", function() {
          var annotation, page;
          annotation = new ReaderAnnotation({
            id: 1
          });
          page = new Page({
            top_annotation: annotation
          });
          return chai.expect(page.get("top_annotation")).to.equal(annotation);
        });
        return it("should parse object", function() {
          var page;
          page = new Page({
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

},{}],36:[function(require,module,exports){
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
      return it("should listen to change", function() {
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

},{}],37:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("populate", function() {
      it("should populate", function() {
        var model;
        model = new Hipbone.Model;
        model.urlRoot = "/populate";
        return chai.expect(model.prepare().state()).to.be.equal("rejected");
      });
      return it("should not populate", function() {
        var model;
        model = new Hipbone.Model;
        model.didSync();
        return chai.expect(model.prepare().state()).to.be.equal("resolved");
      });
    });
  };

}).call(this);

},{}],38:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("store", function() {
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
  };

}).call(this);

},{}],39:[function(require,module,exports){
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
      return it("should unset synced and trigger", function() {
        var model, synced;
        synced = 123;
        model = new Hipbone.Model;
        model.on("unsync", function() {
          return synced = this.synced;
        });
        model.unsync();
        return chai.expect(synced).to.be.equal(void 0);
      });
    });
  };

}).call(this);

},{}],40:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("type", function() {});
  };

}).call(this);

},{}],41:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("validations", function() {
      var Page;
      Page = (function(superClass) {
        extend(Page, superClass);

        function Page() {
          return Page.__super__.constructor.apply(this, arguments);
        }

        Page.prototype.defaults = {
          text: ""
        };

        Page.prototype.validations = {
          text: function(text) {
            return !_.string.isBlank(text);
          }
        };

        return Page;

      })(Hipbone.Model);
      before(function() {
        return this.page = new Page;
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
  };

}).call(this);

},{}],42:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("Model", function() {
      require("./model/type_spec").apply(this);
      require("./model/sync_spec").apply(this);
      require("./model/store_spec").apply(this);
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
            pages: "Pages"
          };

          Book.prototype.computedAttributes = {
            full_title: "fullTitle"
          };

          Book.prototype.fullTitle = function() {
            return (this.get("title")) + " by " + (this.get("author"));
          };

          return Book;

        })(Hipbone.Model);
        Page = (function(superClass) {
          extend(Page, superClass);

          function Page() {
            return Page.__super__.constructor.apply(this, arguments);
          }

          Page.prototype.mappings = {
            book: "Book"
          };

          return Page;

        })(Hipbone.Model);
        Pages = (function(superClass) {
          extend(Pages, superClass);

          function Pages() {
            return Pages.__super__.constructor.apply(this, arguments);
          }

          Pages.prototype.model = Page;

          return Pages;

        })(Hipbone.Collection);
        before(function() {
          this.app = new Hipbone.Application({
            models: {
              Page: Page,
              Book: Book
            },
            collections: {
              Pages: Pages
            }
          });
          return this.book = new Book({
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
          return chai.expect(this.book.toJSON()).to.be.deep.equal({
            cid: this.book.cid,
            id: 5,
            title: "Hipbone",
            author: "Mateus",
            full_title: "Hipbone by Mateus"
          });
        });
        it("should behave as backbone when sync", function() {
          return chai.expect(this.book.toJSON({
            sync: true
          })).to.be.deep.equal({
            id: 5,
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
            id: 5,
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
                    id: 5,
                    title: "Hipbone",
                    author: "Mateus",
                    full_title: "Hipbone by Mateus"
                  },
                  book_id: 5,
                  cid: this.book.get("pages").at(0).cid
                }, {
                  book: {
                    cid: this.book.cid,
                    id: 5,
                    title: "Hipbone",
                    author: "Mateus",
                    full_title: "Hipbone by Mateus"
                  },
                  book_id: 5,
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

},{"./model/computed_attributes_spec":34,"./model/mappings_spec":35,"./model/nested_attributes_spec":36,"./model/populate_spec":37,"./model/store_spec":38,"./model/sync_spec":39,"./model/type_spec":40,"./model/validations_spec":41}],43:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("Module", function() {
      var Submodule, module;
      Submodule = (function(superClass) {
        extend(Submodule, superClass);

        function Submodule() {
          return Submodule.__super__.constructor.apply(this, arguments);
        }

        Submodule.registerModule("Submodule");

        return Submodule;

      })(Hipbone.Module);
      module = {
        foo: 123
      };
      it("should include and call included", function() {
        var included;
        included = false;
        module.included = function() {
          return included = true;
        };
        Submodule.include(module);
        return chai.expect([Submodule.prototype.foo, included]).to.be.deep.equal([123, true]);
      });
      return it("should extend and call extended", function() {
        var extended;
        extended = false;
        module.extended = function() {
          return extended = true;
        };
        Submodule.extend(module);
        return chai.expect([Submodule.foo, extended]).to.be.deep.equal([123, true]);
      });
    });
  };

}).call(this);

},{}],44:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("active", function() {});
  };

}).call(this);

},{}],45:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("parameters", function() {});
  };

}).call(this);

},{}],46:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("populate", function() {});
  };

}).call(this);

},{}],47:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("store", function() {});
  };

}).call(this);

},{}],48:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("title", function() {});
  };

}).call(this);

},{}],49:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("url", function() {});
  };

}).call(this);

},{}],50:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("view", function() {});
  };

}).call(this);

},{}],51:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Route", function() {
      require("./route/url_spec").apply(this);
      require("./route/view_spec").apply(this);
      require("./route/title_spec").apply(this);
      require("./route/store_spec").apply(this);
      require("./route/active_spec").apply(this);
      require("./route/populate_spec").apply(this);
      return require("./route/parameters_spec").apply(this);
    });
  };

}).call(this);

},{"./route/active_spec":44,"./route/parameters_spec":45,"./route/populate_spec":46,"./route/store_spec":47,"./route/title_spec":48,"./route/url_spec":49,"./route/view_spec":50}],52:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("matches", function() {});
  };

}).call(this);

},{}],53:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"dup":49}],54:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Router", function() {
      require("./router/url_spec").apply(this);
      return require("./router/matches_spec").apply(this);
    });
  };

}).call(this);

},{"./router/matches_spec":52,"./router/url_spec":53}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("attribute", function() {});
  };

}).call(this);

},{}],57:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("booleans", function() {});
  };

}).call(this);

},{}],58:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("bubble", function() {});
  };

}).call(this);

},{}],59:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("class name bindings", function() {});
  };

}).call(this);

},{}],60:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("content", function() {});
  };

}).call(this);

},{}],61:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("context", function() {});
  };

}).call(this);

},{}],62:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("elements", function() {});
  };

}).call(this);

},{}],63:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("lifecycle", function() {});
  };

}).call(this);

},{}],64:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],65:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("properties", function() {});
  };

}).call(this);

},{}],66:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],67:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("template", function() {});
  };

}).call(this);

},{}],68:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("update", function() {});
  };

}).call(this);

},{}],69:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("view selector", function() {});
  };

}).call(this);

},{}],70:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("View", function() {
      require("./view/store_spec").apply(this);
      require("./view/bubble_spec").apply(this);
      require("./view/update_spec").apply(this);
      require("./view/content_spec").apply(this);
      require("./view/context_spec").apply(this);
      require("./view/booleans_spec").apply(this);
      require("./view/template_spec").apply(this);
      require("./view/populate_spec").apply(this);
      require("./view/elements_spec").apply(this);
      require("./view/attribute_spec").apply(this);
      require("./view/lifecycle_spec").apply(this);
      require("./view/properties_spec").apply(this);
      require("./view/view_selector_spec").apply(this);
      return require("./view/class_name_bindings_spec").apply(this);
    });
  };

}).call(this);

},{"./view/attribute_spec":56,"./view/booleans_spec":57,"./view/bubble_spec":58,"./view/class_name_bindings_spec":59,"./view/content_spec":60,"./view/context_spec":61,"./view/elements_spec":62,"./view/lifecycle_spec":63,"./view/populate_spec":64,"./view/properties_spec":65,"./view/store_spec":66,"./view/template_spec":67,"./view/update_spec":68,"./view/view_selector_spec":69}],71:[function(require,module,exports){
(function() {
  if (navigator.userAgent.indexOf('PhantomJS') < 0) {
    chai.Assertion.addProperty('model', function() {
      return this._obj instanceof Hipbone.Model;
    });
    chai.Assertion.addProperty('collection', function() {
      return this._obj instanceof Hipbone.Collection;
    });
    describe("hipbone", function() {
      require("./hipbone/module_spec").apply(this);
      require("./hipbone/i18n_spec").apply(this);
      require("./hipbone/identity_map_spec").apply(this);
      require("./hipbone/storage_spec").apply(this);
      require("./hipbone/application_spec").apply(this);
      require("./hipbone/model_spec").apply(this);
      return require("./hipbone/collection_spec").apply(this);
    });
  }

}).call(this);

},{"./hipbone/application_spec":20,"./hipbone/collection_spec":30,"./hipbone/i18n_spec":32,"./hipbone/identity_map_spec":33,"./hipbone/model_spec":42,"./hipbone/module_spec":43,"./hipbone/storage_spec":55}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71]);
