(function() {
  var Handlebars, View, _,
    slice = [].slice;

  _ = require("underscore");

  Handlebars = require("handlebars");

  View = require("./../../view");

  module.exports = function() {
    var eachHelper, ifHelper;
    Handlebars.registerHelper('asset', (function(_this) {
      return function(asset, options) {
        if (options == null) {
          options = {};
        }
        return _this.get("assets")[asset];
      };
    })(this));
    Handlebars.registerHelper('t', (function(_this) {
      return function(key, options) {
        if (options == null) {
          options = {};
        }
        return _this.i18n.t(key, options.hash);
      };
    })(this));
    Handlebars.registerHelper('url', (function(_this) {
      return function(name, options) {
        if (options == null) {
          options = {};
        }
        return _this.router.matchUrl(name, options.hash);
      };
    })(this));
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
    Handlebars.registerHelper('template', function(path, context, options) {
      var template;
      if (context == null) {
        context = {};
      }
      if (options == null) {
        options = {};
      }
      if (context.hash != null) {
        options = context;
        context = {};
      }
      context = _.extend({}, context, options.hash);
      template = this.view.getTemplate(path)(this.view.getContext(context, this));
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
  };

}).call(this);
