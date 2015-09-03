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
