(function() {
  var slice = [].slice;

  Hipbone.Application.prototype.initializers.push(function() {
    var eachHelper, ifHelper;
    Handlebars.registerHelper('asset', function(asset, options) {
      if (options == null) {
        options = {};
      }
      return Hipbone.app.assets[asset];
    });
    Handlebars.registerHelper('t', function(key, options) {
      if (options == null) {
        options = {};
      }
      return Hipbone.app.i18n.t(key, options.hash);
    });
    Handlebars.registerHelper('url', function(name, options) {
      if (options == null) {
        options = {};
      }
      return Hipbone.app.router.buildUrl(name, options.hash);
    });
    Handlebars.registerHelper('fmt', function() {
      var formats, i, index, options, text;
      text = arguments[0], formats = 3 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []), options = arguments[i++];
      if (options == null) {
        options = {};
      }
      index = 0;
      return text.replace(/%@/g, function(format) {
        return formats[index++];
      });
    });
    Handlebars.registerHelper('eval', function(javascript, options) {
      if (options == null) {
        options = {};
      }
      return eval(javascript);
    });
    Handlebars.registerHelper('template', function(path, options) {
      var context, template;
      if (options == null) {
        options = {};
      }
      path = Hipbone.app.templatePath + path;
      context = _.isEmpty(options.hash) ? this : options.hash;
      template = Hipbone.app.templates[path](context);
      if (options.hash.unescape) {
        return template;
      } else {
        return new Handlebars.SafeString(template);
      }
    });
    eachHelper = Handlebars.helpers.each;
    Handlebars.registerHelper('each', function(items, options) {
      if (options == null) {
        options = {};
      }
      if (items) {
        items = items.models || items;
      }
      return eachHelper.apply(this, [items, options]);
    });
    ifHelper = Handlebars.helpers["if"];
    return Handlebars.registerHelper('if', function(conditional, options) {
      var ref;
      if (options == null) {
        options = {};
      }
      if (options.hash.bind && ((ref = _.path(this, conditional)) != null ? ref.models : void 0)) {
        conditional = conditional + ".models";
      } else if (conditional) {
        conditional = conditional.models || conditional;
      }
      return ifHelper.apply(this, [conditional, options]);
    });
  });

}).call(this);
