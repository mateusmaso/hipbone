(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Todo, Todos,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Todo = require("../models/todo");

  module.exports = Todos = (function(superClass) {
    extend(Todos, superClass);

    function Todos() {
      return Todos.__super__.constructor.apply(this, arguments);
    }

    Todos.prototype.model = Todo;

    Todos.prototype.left = function() {
      return this.filter(function(todo) {
        return !todo.get("completed");
      });
    };

    Todos.prototype.completed = function() {
      return this.filter(function(todo) {
        return todo.get("completed");
      });
    };

    Todos.register("Todos");

    return Todos;

  })(Hipbone.Collection);

}).call(this);

},{"../models/todo":6}],2:[function(require,module,exports){
(function() {
  var Todos,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Todos = require("./collections/todos");

  module.exports = window.TodoMVC = (function(superClass) {
    extend(TodoMVC, superClass);

    function TodoMVC() {
      return TodoMVC.__super__.constructor.apply(this, arguments);
    }

    TodoMVC.prototype.initializers = [require("./initializers/match_routes"), require("./initializers/register_attributes")];

    TodoMVC.prototype.locales = {
      en: require("./locales/en")
    };

    TodoMVC.prototype.initialize = function() {
      this.set({
        todos: new Todos(this.storage.get("todos") || [
          {
            text: "um"
          }, {
            text: "dois"
          }, {
            text: "tres"
          }
        ])
      });
      return this.listenTo(this.get("todos"), "update change", (function(_this) {
        return function() {
          return _this.storage.set("todos", _this.get("todos").toJSON({
            sync: true
          }));
        };
      })(this));
    };

    TodoMVC.register("TodoMVC");

    return TodoMVC;

  })(Hipbone.Application);

}).call(this);

},{"./collections/todos":1,"./initializers/match_routes":3,"./initializers/register_attributes":4,"./locales/en":5}],3:[function(require,module,exports){
(function() {
  var ActiveRoute, CompletedRoute, RootRoute;

  CompletedRoute = require("../routes/completed_route");

  ActiveRoute = require("../routes/active_route");

  RootRoute = require("../routes/root_route");

  module.exports = function() {
    this.router.match("completed(/)", {
      route: CompletedRoute,
      name: "completed",
      url: "/completed"
    });
    this.router.match("active(/)", {
      route: ActiveRoute,
      name: "active",
      url: "/active"
    });
    return this.router.match("*all", {
      route: RootRoute,
      url: "/"
    });
  };

}).call(this);

},{"../routes/active_route":7,"../routes/completed_route":8,"../routes/root_route":9}],4:[function(require,module,exports){
(function() {
  module.exports = function() {
    return Handlebars.registerAttribute('autofocus', function(element) {
      var attribute;
      attribute = document.createAttribute('autofocus');
      attribute.value = this.value;
      return attribute;
    }, {
      ready: function(element) {
        return $(element).lifecycle({
          insert: _.once(_.debounce((function(_this) {
            return function() {
              return $(element).focus();
            };
          })(this)))
        });
      }
    });
  };

}).call(this);

},{}],5:[function(require,module,exports){
(function() {
  module.exports = {
    helloWorld: "Hello World"
  };

}).call(this);

},{}],6:[function(require,module,exports){
(function() {
  var Todo,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = Todo = (function(superClass) {
    extend(Todo, superClass);

    function Todo() {
      return Todo.__super__.constructor.apply(this, arguments);
    }

    Todo.prototype.defaults = {
      completed: false
    };

    Todo.register("Todo");

    return Todo;

  })(Hipbone.Model);

}).call(this);

},{}],7:[function(require,module,exports){
(function() {
  var ActiveRoute, RootView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  RootView = require("../views/root_view");

  module.exports = ActiveRoute = (function(superClass) {
    extend(ActiveRoute, superClass);

    function ActiveRoute() {
      return ActiveRoute.__super__.constructor.apply(this, arguments);
    }

    ActiveRoute.prototype.initialize = function() {
      return this.set({
        todos: app.get("todos")
      });
    };

    ActiveRoute.prototype.element = function() {
      return new RootView({
        todos: this.get("todos")
      }).el;
    };

    ActiveRoute.register("ActiveRoute");

    return ActiveRoute;

  })(Hipbone.Route);

}).call(this);

},{"../views/root_view":11}],8:[function(require,module,exports){
(function() {
  var CompletedRoute, RootView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  RootView = require("../views/root_view");

  module.exports = CompletedRoute = (function(superClass) {
    extend(CompletedRoute, superClass);

    function CompletedRoute() {
      return CompletedRoute.__super__.constructor.apply(this, arguments);
    }

    CompletedRoute.prototype.initialize = function() {
      return this.set({
        todos: app.get("todos")
      });
    };

    CompletedRoute.prototype.element = function() {
      return new RootView({
        todos: this.get("todos")
      }).el;
    };

    CompletedRoute.register("CompletedRoute");

    return CompletedRoute;

  })(Hipbone.Route);

}).call(this);

},{"../views/root_view":11}],9:[function(require,module,exports){
(function() {
  var RootRoute, RootView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  RootView = require("../views/root_view");

  module.exports = RootRoute = (function(superClass) {
    extend(RootRoute, superClass);

    function RootRoute() {
      return RootRoute.__super__.constructor.apply(this, arguments);
    }

    RootRoute.prototype.initialize = function() {
      return this.set({
        todos: app.get("todos")
      });
    };

    RootRoute.prototype.element = function() {
      return new RootView({
        todos: this.get("todos")
      }).el;
    };

    RootRoute.register("RootRoute");

    return RootRoute;

  })(Hipbone.Route);

}).call(this);

},{"../views/root_view":11}],10:[function(require,module,exports){
this["Templates"] = this["Templates"] || {};

this["Templates"]["app/templates/root"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "      <button class=\"clear-completed\">Clear completed</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<section class=\"todoapp\">\n  <header class=\"header\">\n    <h1>todos</h1>\n    <input class=\"new-todo\" placeholder=\"What needs to be done?\" autofocus>\n  </header>\n\n  <section class=\"main\">\n    <input class=\"toggle-all\" type=\"checkbox\">\n    <label for=\"toggle-all\">Mark all as complete</label>\n    <hb-todos todos=\""
    + alias3(((helper = (helper = helpers.todos || (depth0 != null ? depth0.todos : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"todos","hash":{},"data":data}) : helper)))
    + "\"></hb-todos>\n  </section>\n\n  <footer class=\"footer\"></footer>\n\n  <footer class=\"footer\">\n		<span class=\"todo-count\"><strong>"
    + alias3((helpers.bind || (depth0 && depth0.bind) || alias2).call(alias1,"leftCount",{"name":"bind","hash":{},"data":data}))
    + "</strong> items left</span>\n		<ul class=\"filters\">\n			<li>\n				<a class=\"selected\" href=\"#/\">All</a>\n			</li>\n			<li>\n				<a href=\""
    + alias3((helpers.url || (depth0 && depth0.url) || alias2).call(alias1,"active",{"name":"url","hash":{},"data":data}))
    + "\">Active</a>\n			</li>\n			<li>\n				<a href=\""
    + alias3((helpers.url || (depth0 && depth0.url) || alias2).call(alias1,"completed",{"name":"url","hash":{},"data":data}))
    + "\">Completed</a>\n			</li>\n		</ul>\n\n"
    + ((stack1 = helpers["if"].call(alias1,"completedCount",{"name":"if","hash":{"bind":true},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</footer>\n</section>\n\n<footer class=\"info\">\n  <p>Double-click to edit a todo</p>\n  <p>Written by <a href=\"https://github.com/mateusmaso\">Mateus Maso</a></p>\n  <p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>\n</footer>\n";
},"useData":true});

this["Templates"]["app/templates/todo"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.escapeExpression;

  return "  <input class=\"toggle\" type=\"checkbox\" "
    + alias1(helpers["if"].call(depth0 != null ? depth0 : {},"todo.completed",{"name":"if","hash":{"then":"checked","bindAttr":true},"data":data}))
    + ">\n  <label>"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.todo : depth0)) != null ? stack1.text : stack1), depth0))
    + "</label>\n  <button class=\"destroy\"></button>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  <input class=\"edit\" value=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.todo : depth0)) != null ? stack1.text : stack1), depth0))
    + "\" hb-autofocus>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : {},"editing",{"name":"unless","hash":{"bind":true},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

this["Templates"]["app/templates/todos"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "  <hb-todo todo=\""
    + container.escapeExpression(((helper = (helper = helpers.todo || (depth0 != null ? depth0.todo : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"todo","hash":{},"data":data}) : helper)))
    + "\"></hb-todo>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.todos : depth0),{"name":"each","hash":{"bind":true,"var":"todo"},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
},{}],11:[function(require,module,exports){
(function() {
  var RootView, Todo, TodosView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require("./view");

  TodosView = require("./todos_view");

  Todo = require("../models/todo");

  module.exports = RootView = (function(superClass) {
    extend(RootView, superClass);

    function RootView() {
      return RootView.__super__.constructor.apply(this, arguments);
    }

    RootView.prototype.templateName = "/root";

    RootView.prototype.elements = {
      newTodo: ".new-todo",
      toggleAll: ".toggle-all",
      clearCompleted: ".clear-completed"
    };

    RootView.prototype.events = {
      "keypress newTodo": "addTodo",
      "click toggleAll": "toggleAll",
      "click clearCompleted": "clearCompleted"
    };

    RootView.prototype.defaults = {
      toggleAll: false
    };

    RootView.prototype.initialize = function() {
      this.listenTo(this.get("todos"), "update", this.update);
      return this.listenTo(this.get("todos"), "change:completed", this.update);
    };

    RootView.prototype.context = function() {
      return {
        todos: this.get("todos"),
        leftCount: this.get("todos").left().length,
        completedCount: this.get("todos").completed().length
      };
    };

    RootView.prototype.addTodo = function(event) {
      var text;
      if (event.keyCode !== 13) {
        return;
      }
      text = this.$("newTodo").val();
      if (text.trim() !== "") {
        this.$("newTodo").val("");
        return this.get("todos").add(new Todo({
          text: text
        }));
      }
    };

    RootView.prototype.toggleAll = function() {
      var i, len, ref, todo;
      ref = this.get("todos").models;
      for (i = 0, len = ref.length; i < len; i++) {
        todo = ref[i];
        todo.set({
          completed: !this.get("toggleAll")
        });
      }
      return this.set("toggleAll", !this.get("toggleAll"));
    };

    RootView.prototype.clearCompleted = function() {
      var i, j, len, len1, ref, results, toDestroy, todo;
      toDestroy = [];
      ref = this.get("todos").models;
      for (i = 0, len = ref.length; i < len; i++) {
        todo = ref[i];
        if (todo.get("completed")) {
          toDestroy.push(todo);
        }
      }
      results = [];
      for (j = 0, len1 = toDestroy.length; j < len1; j++) {
        todo = toDestroy[j];
        results.push(todo.destroy());
      }
      return results;
    };

    RootView.register("RootView");

    return RootView;

  })(View);

}).call(this);

},{"../models/todo":6,"./todos_view":13,"./view":14}],12:[function(require,module,exports){
(function() {
  var TodoView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require("./view");

  module.exports = TodoView = (function(superClass) {
    extend(TodoView, superClass);

    function TodoView() {
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.prototype.tagName = "li";

    TodoView.prototype.templateName = "/todo";

    TodoView.prototype.elements = {
      destroy: ".destroy",
      toggle: ".toggle",
      edit: ".edit"
    };

    TodoView.prototype.events = {
      "click destroy": "removeTodo",
      "click toggle": "toggleTodo",
      "dblclick label": "editTodo",
      "blur edit": "stopEditTodo",
      'keyup edit': 'saveTodo'
    };

    TodoView.prototype.classNameBindings = {
      editing: function() {
        return this.get("editing");
      },
      completed: function() {
        return this.get("todo").get("completed");
      }
    };

    TodoView.prototype.defaults = {
      editing: false
    };

    TodoView.prototype.initialize = function() {
      return this.listenTo(this.get("todo"), "change", this.update);
    };

    TodoView.prototype.removeTodo = function() {
      return this.get("todo").destroy();
    };

    TodoView.prototype.toggleTodo = function() {
      return this.get("todo").set({
        completed: !this.get("todo").get("completed")
      });
    };

    TodoView.prototype.editTodo = function() {
      return this.set({
        editing: true
      });
    };

    TodoView.prototype.stopEditTodo = function() {
      return this.set({
        editing: false
      });
    };

    TodoView.prototype.saveTodo = function(event) {
      if (event.type === 'keyup' && event.keyCode !== 13) {
        return;
      }
      if (this.$("edit").val().trim() === "") {
        return this.removeTodo();
      }
      this.get("todo").set({
        text: this.$("edit").val()
      });
      return this.stopEditTodo();
    };

    TodoView.register("TodoView");

    return TodoView;

  })(View);

}).call(this);

},{"./view":14}],13:[function(require,module,exports){
(function() {
  var TodoView, TodosView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require("./view");

  TodoView = require("./todo_view");

  module.exports = TodosView = (function(superClass) {
    extend(TodosView, superClass);

    function TodosView() {
      return TodosView.__super__.constructor.apply(this, arguments);
    }

    TodosView.prototype.tagName = "ul";

    TodosView.prototype.templateName = "/todos";

    TodosView.prototype.className = "todo-list";

    TodosView.prototype.initialize = function() {
      return this.listenTo(this.get("todos"), "update", this.update);
    };

    TodosView.register("TodosView");

    return TodosView;

  })(View);

}).call(this);

},{"./todo_view":12,"./view":14}],14:[function(require,module,exports){
(function() {
  var View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = View = (function(superClass) {
    extend(View, superClass);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.templatePath = "app/templates";

    View.prototype.templates = require("./../templates").Templates;

    View.register("View");

    return View;

  })(Hipbone.View);

}).call(this);

},{"./../templates":10}]},{},[2]);
