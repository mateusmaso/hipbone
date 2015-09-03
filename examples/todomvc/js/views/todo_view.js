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
