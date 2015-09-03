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
