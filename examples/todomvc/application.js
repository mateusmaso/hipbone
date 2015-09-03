(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.TodoMVC = (function(superClass) {
    extend(TodoMVC, superClass);

    function TodoMVC() {
      return TodoMVC.__super__.constructor.apply(this, arguments);
    }

    TodoMVC.prototype.host = "/api/v1";

    TodoMVC.prototype.locale = "pt-BR";

    TodoMVC.prototype.title = "Todo MVC";

    return TodoMVC;

  })(Hipbone.Application);

}).call(this);

(function() {
  TodoMVC.prototype.initializers.push(function() {
    this.templates = HandlebarsTemplates;
    return this.templatePath = "js/templates";
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

    Todo.prototype.urlRoot = "/todo";

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

    Todos.prototype.urlRoot = "/todos";

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

    RootRoute.prototype.matchUrl = "(/)";

    RootRoute.prototype.templateName = "/application";

    RootRoute.prototype.initialize = function() {
      return this.set({
        todos: new TodoMVC.Todos()
      });
    };

    RootRoute.prototype.transition = function() {
      if (this.withoutCurrentUser()) {
        return false;
      }
    };

    RootRoute.prototype.fetch = function() {
      return this.get("todos").fetch();
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

    TodoView.prototype.templateName = "/todo";

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

    TodosView.prototype.templateName = "/todos";

    return TodosView;

  })(Hipbone.View);

}).call(this);
