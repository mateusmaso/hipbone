(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.TodoMVC = (function(superClass) {
    extend(TodoMVC, superClass);

    function TodoMVC() {
      return TodoMVC.__super__.constructor.apply(this, arguments);
    }

    return TodoMVC;

  })(Hipbone.Application);

}).call(this);

(function() {
  TodoMVC.prototype.initializers.push(function() {
    this.templates = HandlebarsTemplates;
    return this.templatePath = "coffee/templates";
  });

}).call(this);

(function() {
  TodoMVC.prototype.initializers.push(function() {
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

    return Todos;

  })(Hipbone.Collection);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TodoMVC.RootRoute = (function(superClass) {
    extend(RootRoute, superClass);

    function RootRoute() {
      return RootRoute.__super__.constructor.apply(this, arguments);
    }

    RootRoute.prototype.matchUrl = "*all";

    RootRoute.prototype.templateName = "/application";

    RootRoute.prototype.initialize = function() {
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

    RootRoute.prototype.buildUrl = function() {
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
      newTodo: ".new-todo"
    };

    RootView.prototype.events = {
      "keypress newTodo": "addTodo"
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
      destroy: ".destroy"
    };

    TodoView.prototype.events = {
      "click destroy": "removeTodo"
    };

    TodoView.prototype.removeTodo = function() {
      return this.get("todo").destroy();
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
