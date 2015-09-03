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
