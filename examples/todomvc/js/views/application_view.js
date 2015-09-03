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
