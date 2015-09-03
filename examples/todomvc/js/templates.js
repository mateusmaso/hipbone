this["HandlebarsTemplates"] = this["HandlebarsTemplates"] || {};

this["HandlebarsTemplates"]["coffee/templates/application"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"main\"></div>\n";
  });

this["HandlebarsTemplates"]["coffee/templates/root"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<section class=\"todoapp\">\n  <header class=\"header\">\n    <h1>todos</h1>\n    <input class=\"new-todo\" placeholder=\"What needs to be done?\" autofocus>\n  </header>\n\n  <section class=\"main\">\n    <input class=\"toggle-all\" type=\"checkbox\">\n    <label for=\"toggle-all\">Mark all as complete</label>\n    <hb-todos todos=\"";
  if (helper = helpers.todos) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.todos); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></hb-todos>\n  </section>\n\n  <footer class=\"footer\"></footer>\n</section>\n\n<footer class=\"info\">\n  <p>Double-click to edit a todo</p>\n  <p>Written by <a href=\"https://github.com/mateusmaso\">Mateus Maso</a></p>\n  <p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>\n</footer>\n";
  return buffer;
  });

this["HandlebarsTemplates"]["coffee/templates/todo"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n  <input class=\"toggle\" type=\"checkbox\">\n  <label>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.todo)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\n  <button class=\"destroy\"></button>\n</div>\n\n<input class=\"edit\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.todo)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n";
  return buffer;
  });

this["HandlebarsTemplates"]["coffee/templates/todos"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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