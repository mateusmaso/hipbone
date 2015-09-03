this["HandlebarsTemplates"] = this["HandlebarsTemplates"] || {};

this["HandlebarsTemplates"]["js/templates/application"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<section class=\"todoapp\">\n  <header class=\"header\">\n    <h1>todos</h1>\n    <input class=\"new-todo\" placeholder=\"What needs to be done?\" autofocus>\n  </header>\n  <section class=\"main\">\n    <input class=\"toggle-all\" type=\"checkbox\">\n    <label for=\"toggle-all\">Mark all as complete</label>\n    <ul class=\"todo-list\"></ul>\n  </section>\n  <footer class=\"footer\"></footer>\n</section>\n<footer class=\"info\">\n  <p>Double-click to edit a todo</p>\n  <p>Written by <a href=\"https://github.com/mateusmaso\">Mateus Maso</a></p>\n  <p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>\n</footer>\n";
  });