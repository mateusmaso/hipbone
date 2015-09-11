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
  var App,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App = (function(superClass) {
    extend(App, superClass);

    function App() {
      return App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.locales = {
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
    };

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

    Book.prototype.computedAttributes = {
      full_title: "fullTitle",
      fullTitle: function() {
        return (this.get("title")) + " by " + (this.get("author"));
      }
    };

    return Book;

  })(Hipbone.Model);

  App.Page = (function(superClass) {
    extend(Page, superClass);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.urlRoot = "/pages";

    Page.prototype.mappings = {
      book: "Book"
    };

    Page.prototype.polymorphics = ["top_annotation"];

    Page.prototype.validations = {
      text: function(text) {
        return !_.string.isBlank(text);
      }
    };

    return Page;

  })(Hipbone.Model);

  App.ReaderAnnotation = (function(superClass) {
    extend(ReaderAnnotation, superClass);

    function ReaderAnnotation() {
      return ReaderAnnotation.__super__.constructor.apply(this, arguments);
    }

    ReaderAnnotation.prototype.urlRoot = "/annotations";

    ReaderAnnotation.prototype.filters = {
      reader: true
    };

    return ReaderAnnotation;

  })(Hipbone.Model);

  App.AuthorAnnotation = (function(superClass) {
    extend(AuthorAnnotation, superClass);

    function AuthorAnnotation() {
      return AuthorAnnotation.__super__.constructor.apply(this, arguments);
    }

    return AuthorAnnotation;

  })(Hipbone.Model);

  App.ReaderAnnotations = (function(superClass) {
    extend(ReaderAnnotations, superClass);

    function ReaderAnnotations() {
      return ReaderAnnotations.__super__.constructor.apply(this, arguments);
    }

    ReaderAnnotations.prototype.urlRoot = "/annotations";

    ReaderAnnotations.prototype.filters = {
      reader: true
    };

    ReaderAnnotations.prototype.pagination = {
      offset: 0,
      limit: 10
    };

    return ReaderAnnotations;

  })(Hipbone.Collection);

  App.Annotations = (function(superClass) {
    extend(Annotations, superClass);

    function Annotations() {
      return Annotations.__super__.constructor.apply(this, arguments);
    }

    Annotations.prototype.urlRoot = "/annotations";

    return Annotations;

  })(Hipbone.Collection);

  App.Books = (function(superClass) {
    extend(Books, superClass);

    function Books() {
      return Books.__super__.constructor.apply(this, arguments);
    }

    return Books;

  })(Hipbone.Collection);

  App.Pages = (function(superClass) {
    extend(Pages, superClass);

    function Pages() {
      return Pages.__super__.constructor.apply(this, arguments);
    }

    Pages.prototype.model = App.Page;

    return Pages;

  })(Hipbone.Collection);

  App.BookRoute = (function(superClass) {
    extend(BookRoute, superClass);

    function BookRoute() {
      return BookRoute.__super__.constructor.apply(this, arguments);
    }

    return BookRoute;

  })(Hipbone.Route);

  App.BookView = (function(superClass) {
    extend(BookView, superClass);

    function BookView() {
      return BookView.__super__.constructor.apply(this, arguments);
    }

    BookView.prototype.defaults = {
      copyright: false,
      title: "Unknown"
    };

    return BookView;

  })(Hipbone.View);

  module.exports = App;

}).call(this);

},{}],2:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("ajax", function() {});
  };

}).call(this);

},{}],3:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("collections", function() {
      return it("should contain defined", function() {
        return chai.expect(this.app.collections.Books).to.be.equal(App.Books);
      });
    });
  };

}).call(this);

},{}],4:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("link bridge", function() {});
  };

}).call(this);

},{}],5:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("parse body", function() {});
  };

}).call(this);

},{}],6:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("parse model", function() {});
  };

}).call(this);

},{}],7:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("prevent form", function() {});
  };

}).call(this);

},{}],8:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("register elements", function() {});
  };

}).call(this);

},{}],9:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("register helpers", function() {});
  };

}).call(this);

},{}],10:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("register modules", function() {});
  };

}).call(this);

},{}],11:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("start history", function() {});
  };

}).call(this);

},{}],12:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("sync", function() {});
  };

}).call(this);

},{}],13:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("initializers", function() {
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
    return describe("locales", function() {});
  };

}).call(this);

},{}],15:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("models", function() {
      return it("should contain defined", function() {
        return chai.expect(this.app.models.Book).to.be.equal(App.Book);
      });
    });
  };

}).call(this);

},{}],16:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("routes", function() {
      return it("should contain defined", function() {
        return chai.expect(this.app.routes.BookRoute).to.be.equal(App.BookRoute);
      });
    });
  };

}).call(this);

},{}],17:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("state", function() {});
  };

}).call(this);

},{}],18:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("templates", function() {});
  };

}).call(this);

},{}],19:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("views", function() {
      return it("should contain defined", function() {
        return chai.expect(this.app.views.BooView).to.be.equal(App.BooView);
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
  module.exports = function() {
    return describe("dynamic model", function() {});
  };

}).call(this);

},{}],22:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("filters", function() {});
  };

}).call(this);

},{}],23:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("meta", function() {});
  };

}).call(this);

},{}],24:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("pagination", function() {});
  };

}).call(this);

},{}],25:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("parent", function() {});
  };

}).call(this);

},{}],26:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("populate", function() {});
  };

}).call(this);

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],29:[function(require,module,exports){
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
      require("./collection/dynamic_model_spec").apply(this);
      return describe("json", function() {});
    });
  };

}).call(this);

},{"./collection/dynamic_model_spec":21,"./collection/filters_spec":22,"./collection/meta_spec":23,"./collection/pagination_spec":24,"./collection/parent_spec":25,"./collection/populate_spec":26,"./collection/store_spec":27,"./collection/sync_spec":28}],30:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("History", function() {});
  };

}).call(this);

},{}],31:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("I18n", function() {
      describe("interpolate", function() {
        return it("should interpolate variable", function() {
          return chai.expect(this.app.i18n.translate("hello", {
            name: "World"
          })).to.be.equal("Hello World!");
        });
      });
      describe("pluralize", function() {
        it("should be zero", function() {
          return chai.expect(this.app.i18n.translate("comment", {
            count: 0
          })).to.be.equal("no comments yet");
        });
        it("should be one", function() {
          return chai.expect(this.app.i18n.translate("comment", {
            count: 1
          })).to.be.equal("1 comment");
        });
        return it("should be other", function() {
          return chai.expect(this.app.i18n.translate("comment", {
            count: 2
          })).to.be.equal("2 comments");
        });
      });
      return describe("inflector", function() {
        it("should be male", function() {
          return chai.expect(this.app.i18n.translate("baby", {
            gender: "m"
          })).to.be.equal("it's a boy");
        });
        it("should be female", function() {
          return chai.expect(this.app.i18n.translate("baby", {
            gender: "f"
          })).to.be.equal("it's a girl");
        });
        return it("should be neutral", function() {
          return chai.expect(this.app.i18n.translate("baby", {
            gender: ""
          })).to.be.equal("not sure");
        });
      });
    });
  };

}).call(this);

},{}],32:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Identity Map", function() {});
  };

}).call(this);

},{}],33:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("computed attributes", function() {});
  };

}).call(this);

},{}],34:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("mappings", function() {});
  };

}).call(this);

},{}],35:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("nested Attributes", function() {});
  };

}).call(this);

},{}],36:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],39:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("type", function() {});
  };

}).call(this);

},{}],40:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("validations", function() {});
  };

}).call(this);

},{}],41:[function(require,module,exports){
(function() {
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
      return describe("json", function() {});
    });
  };

}).call(this);

},{"./model/computed_attributes_spec":33,"./model/mappings_spec":34,"./model/nested_attributes_spec":35,"./model/populate_spec":36,"./model/store_spec":37,"./model/sync_spec":38,"./model/type_spec":39,"./model/validations_spec":40}],42:[function(require,module,exports){
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function() {
    return describe("Module", function() {
      before(function() {
        this.Submodule = (function(superClass) {
          extend(Submodule, superClass);

          function Submodule() {
            return Submodule.__super__.constructor.apply(this, arguments);
          }

          Submodule.registerModule("Submodule");

          return Submodule;

        })(Hipbone.Module);
        return this.module = {
          foo: 123
        };
      });
      it("should include and call included", function() {
        var included;
        included = false;
        this.module.included = function() {
          return included = true;
        };
        this.Submodule.include(this.module);
        return chai.expect([this.Submodule.prototype.foo, included]).to.be.deep.equal([123, true]);
      });
      return it("should extend and call extended", function() {
        var extended;
        extended = false;
        this.module.extended = function() {
          return extended = true;
        };
        this.Submodule.extend(this.module);
        return chai.expect([this.Submodule.foo, extended]).to.be.deep.equal([123, true]);
      });
    });
  };

}).call(this);

},{}],43:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("active", function() {});
  };

}).call(this);

},{}],44:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("parameters", function() {});
  };

}).call(this);

},{}],45:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],46:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("store", function() {});
  };

}).call(this);

},{}],47:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("title", function() {});
  };

}).call(this);

},{}],48:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("url", function() {});
  };

}).call(this);

},{}],49:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("view", function() {});
  };

}).call(this);

},{}],50:[function(require,module,exports){
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

},{"./route/active_spec":43,"./route/parameters_spec":44,"./route/populate_spec":45,"./route/store_spec":46,"./route/title_spec":47,"./route/url_spec":48,"./route/view_spec":49}],51:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("matches", function() {});
  };

}).call(this);

},{}],52:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],53:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Router", function() {
      require("./router/url_spec").apply(this);
      return require("./router/matches_spec").apply(this);
    });
  };

}).call(this);

},{"./router/matches_spec":51,"./router/url_spec":52}],54:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("Storage", function() {});
  };

}).call(this);

},{}],55:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("attribute", function() {});
  };

}).call(this);

},{}],56:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("booleans", function() {});
  };

}).call(this);

},{}],57:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("bubble", function() {});
  };

}).call(this);

},{}],58:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("class name bindings", function() {});
  };

}).call(this);

},{}],59:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("content", function() {});
  };

}).call(this);

},{}],60:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("context", function() {});
  };

}).call(this);

},{}],61:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("elements", function() {});
  };

}).call(this);

},{}],62:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("lifecycle", function() {});
  };

}).call(this);

},{}],63:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],64:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("properties", function() {});
  };

}).call(this);

},{}],65:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],66:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("template", function() {});
  };

}).call(this);

},{}],67:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("update", function() {});
  };

}).call(this);

},{}],68:[function(require,module,exports){
(function() {
  module.exports = function() {
    return describe("view selector", function() {});
  };

}).call(this);

},{}],69:[function(require,module,exports){
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

},{"./view/attribute_spec":55,"./view/booleans_spec":56,"./view/bubble_spec":57,"./view/class_name_bindings_spec":58,"./view/content_spec":59,"./view/context_spec":60,"./view/elements_spec":61,"./view/lifecycle_spec":62,"./view/populate_spec":63,"./view/properties_spec":64,"./view/store_spec":65,"./view/template_spec":66,"./view/update_spec":67,"./view/view_selector_spec":68}],70:[function(require,module,exports){
(function() {
  if (navigator.userAgent.indexOf('PhantomJS') < 0) {
    chai.Assertion.addProperty('model', function() {
      return this._obj instanceof Hipbone.Model;
    });
    chai.Assertion.addProperty('collection', function() {
      return this._obj instanceof Hipbone.Collection;
    });
    describe("hipbone", function() {
      var App;
      App = window.App = require("./fixtures/app");
      before(function() {
        this.app = window.app = new App();
        return this.app.run();
      });
      beforeEach(function() {
        return this.app.identityMap.clear();
      });
      require("./hipbone/i18n_spec").apply(this);
      require("./hipbone/view_spec").apply(this);
      require("./hipbone/model_spec").apply(this);
      require("./hipbone/route_spec").apply(this);
      require("./hipbone/module_spec").apply(this);
      require("./hipbone/router_spec").apply(this);
      require("./hipbone/history_spec").apply(this);
      require("./hipbone/storage_spec").apply(this);
      require("./hipbone/collection_spec").apply(this);
      require("./hipbone/application_spec").apply(this);
      return require("./hipbone/identity_map_spec").apply(this);
    });
  }

}).call(this);

},{"./fixtures/app":1,"./hipbone/application_spec":20,"./hipbone/collection_spec":29,"./hipbone/history_spec":30,"./hipbone/i18n_spec":31,"./hipbone/identity_map_spec":32,"./hipbone/model_spec":41,"./hipbone/module_spec":42,"./hipbone/route_spec":50,"./hipbone/router_spec":53,"./hipbone/storage_spec":54,"./hipbone/view_spec":69}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70]);
