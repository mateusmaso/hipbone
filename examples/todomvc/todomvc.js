(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.TodoMVC = (function(superClass) {
    extend(TodoMVC, superClass);

    function TodoMVC() {
      return TodoMVC.__super__.constructor.apply(this, arguments);
    }

    TodoMVC.prototype.initialize = function() {
      return this.set({
        todos: new TodoMVC.Todos([
          {
            text: "um"
          }, {
            text: "dois"
          }, {
            text: "tres"
          }
        ])
      });
    };

    return TodoMVC;

  })(Hipbone.Application);

}).call(this);

(function() {
  TodoMVC.prototype.initializers.push(function() {
    this.templates = HandlebarsTemplates;
    return this.templatePath = "todomvc/templates";
  });

}).call(this);

(function() {
  TodoMVC.prototype.initializers.push(function() {
    return Handlebars.registerAttribute('autofocus', function(element) {
      var attribute;
      attribute = document.createAttribute('autofocus');
      attribute.value = this.value;
      return attribute;
    }, {
      ready: function(element) {
        return $(element).lifecycle({
          insert: _.once((function(_this) {
            return function() {
              return _.defer(function() {
                return $(element).focus();
              });
            };
          })(this))
        });
      }
    });
  });

}).call(this);

(function() {
  TodoMVC.prototype.initializers.push(function() {
    this.router.match("completed");
    this.router.match("active");
    return this.router.match("root");
  });

}).call(this);

(function() {
  TodoMVC.prototype.locales['en'] = {};

}).call(this);

(function() {
  TodoMVC.prototype.locales['pt-BR'] = {};

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.Todo = (function(superClass) {
    extend(Todo, superClass);

    function Todo() {
      return Todo.__super__.constructor.apply(this, arguments);
    }

    Todo.prototype.defaults = {
      completed: false
    };

    return Todo;

  })(Hipbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.Todos = (function(superClass) {
    extend(Todos, superClass);

    function Todos() {
      return Todos.__super__.constructor.apply(this, arguments);
    }

    Todos.prototype.model = TodoMVC.Todo;

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

    return Todos;

  })(Hipbone.Collection);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.ActiveRoute = (function(superClass) {
    extend(ActiveRoute, superClass);

    function ActiveRoute() {
      return ActiveRoute.__super__.constructor.apply(this, arguments);
    }

    ActiveRoute.prototype.url = "active(/)";

    ActiveRoute.prototype.templateName = "/application";

    ActiveRoute.prototype.initialize = function() {
      return this.set({
        todos: app.get("todos")
      });
    };

    ActiveRoute.prototype.toURL = function() {
      return "/active";
    };

    ActiveRoute.prototype.content = function() {
      return new TodoMVC.RootView({
        todos: this.get("todos")
      }).el;
    };

    return ActiveRoute;

  })(Hipbone.Route);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.CompletedRoute = (function(superClass) {
    extend(CompletedRoute, superClass);

    function CompletedRoute() {
      return CompletedRoute.__super__.constructor.apply(this, arguments);
    }

    CompletedRoute.prototype.url = "completed(/)";

    CompletedRoute.prototype.templateName = "/application";

    CompletedRoute.prototype.initialize = function() {
      return this.set({
        todos: app.get("todos")
      });
    };

    CompletedRoute.prototype.toURL = function() {
      return "/completed";
    };

    CompletedRoute.prototype.content = function() {
      return new TodoMVC.RootView({
        todos: this.get("todos")
      }).el;
    };

    return CompletedRoute;

  })(Hipbone.Route);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.RootRoute = (function(superClass) {
    extend(RootRoute, superClass);

    function RootRoute() {
      return RootRoute.__super__.constructor.apply(this, arguments);
    }

    RootRoute.prototype.url = "*all";

    RootRoute.prototype.templateName = "/application";

    RootRoute.prototype.initialize = function() {
      return this.set({
        todos: app.get("todos")
      });
    };

    RootRoute.prototype.toURL = function() {
      return "/";
    };

    RootRoute.prototype.content = function() {
      return new TodoMVC.RootView({
        todos: this.get("todos")
      }).el;
    };

    return RootRoute;

  })(Hipbone.Route);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.ApplicationView = (function(superClass) {
    extend(ApplicationView, superClass);

    function ApplicationView() {
      return ApplicationView.__super__.constructor.apply(this, arguments);
    }

    ApplicationView.prototype.container = ".main";

    ApplicationView.prototype.templateName = "/application";

    return ApplicationView;

  })(Hipbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.RootView = (function(superClass) {
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
      if (!_.string.isBlank(text)) {
        this.$("newTodo").val("");
        return this.get("todos").add(new TodoMVC.Todo({
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

    return RootView;

  })(Hipbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.TodoView = (function(superClass) {
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
      if (_.string.isBlank(this.$("edit").val())) {
        return this.removeTodo();
      }
      this.get("todo").set({
        text: this.$("edit").val()
      });
      return this.stopEditTodo();
    };

    return TodoView;

  })(Hipbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.TodosView = (function(superClass) {
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

    return TodosView;

  })(Hipbone.View);

}).call(this);

this["HandlebarsTemplates"] = this["HandlebarsTemplates"] || {};

this["HandlebarsTemplates"]["todomvc/templates/application"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"main\"></div>\n";
  });

this["HandlebarsTemplates"]["todomvc/templates/root"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  
  return "\n      <button class=\"clear-completed\">Clear completed</button>\n    ";
  }

  buffer += "<section class=\"todoapp\">\n  <header class=\"header\">\n    <h1>todos</h1>\n    <input class=\"new-todo\" placeholder=\"What needs to be done?\" autofocus>\n  </header>\n\n  <section class=\"main\">\n    <input class=\"toggle-all\" type=\"checkbox\">\n    <label for=\"toggle-all\">Mark all as complete</label>\n    <hb-todos todos=\"";
  if (helper = helpers.todos) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.todos); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></hb-todos>\n  </section>\n\n  <footer class=\"footer\"></footer>\n\n  <footer class=\"footer\">\n		<span class=\"todo-count\"><strong>"
    + escapeExpression((helper = helpers.bind || (depth0 && depth0.bind),options={hash:{},data:data},helper ? helper.call(depth0, "leftCount", options) : helperMissing.call(depth0, "bind", "leftCount", options)))
    + "</strong> items left</span>\n		<ul class=\"filters\">\n			<li>\n				<a class=\"selected\" href=\"#/\">All</a>\n			</li>\n			<li>\n				<a href=\""
    + escapeExpression((helper = helpers.url || (depth0 && depth0.url),options={hash:{},data:data},helper ? helper.call(depth0, "active", options) : helperMissing.call(depth0, "url", "active", options)))
    + "\">Active</a>\n			</li>\n			<li>\n				<a href=\""
    + escapeExpression((helper = helpers.url || (depth0 && depth0.url),options={hash:{},data:data},helper ? helper.call(depth0, "completed", options) : helperMissing.call(depth0, "url", "completed", options)))
    + "\">Completed</a>\n			</li>\n		</ul>\n\n    ";
  stack1 = helpers['if'].call(depth0, "completedCount", {hash:{
    'bind': (true)
  },inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</footer>\n</section>\n\n<footer class=\"info\">\n  <p>Double-click to edit a todo</p>\n  <p>Written by <a href=\"https://github.com/mateusmaso\">Mateus Maso</a></p>\n  <p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>\n</footer>\n";
  return buffer;
  });

this["HandlebarsTemplates"]["todomvc/templates/todo"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <input class=\"toggle\" type=\"checkbox\" "
    + escapeExpression(helpers['if'].call(depth0, "todo.completed", {hash:{
    'bindAttr': (true),
    'then': ("checked")
  },data:data}))
    + ">\n  <label>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.todo)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\n  <button class=\"destroy\"></button>\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <input class=\"edit\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.todo)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" hb-autofocus>\n";
  return buffer;
  }

  stack1 = helpers.unless.call(depth0, "editing", {hash:{
    'bind': (true)
  },inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

this["HandlebarsTemplates"]["todomvc/templates/todos"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n  <hb-todo todo=\"";
  if (helper = helpers.todo) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.todo); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></hb-todo>\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, (depth0 && depth0.todos), {hash:{
    'var': ("todo"),
    'bind': (true)
  },inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });