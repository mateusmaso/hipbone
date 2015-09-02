(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Application = (function(superClass) {
    extend(Application, superClass);

    Application.include(Hipbone.Ajax);

    Application.include(Hipbone.Accessor);

    Application.include(Backbone.Events);

    Application.prototype.locales = {};

    Application.prototype.initializers = [];

    function Application(options) {
      var i, initializer, len, ref;
      if (options == null) {
        options = {};
      }
      Hipbone.app = this;
      this.views || (this.views = options.views || {});
      this.title || (this.title = options.title || 'App');
      this.locale || (this.locale = options.local || 'en');
      this.models || (this.models = options.models || {});
      this.assets || (this.assets = options.assets || {});
      this.routes || (this.routes = options.routes || {});
      this.matches || (this.matches = options.matches || []);
      this.templates || (this.templates = options.templates || {});
      this.collections || (this.collections = options.collections || {});
      this.templatePath || (this.templatePath = options.templatePath || '');
      if (options.locales) {
        this.locales = options.locales;
      }
      if (options.initializers) {
        this.initializers = options.initializers;
      }
      this.i18n = new Hipbone.I18n(this.locales[this.locale]);
      this.router = new Hipbone.Router({
        matches: this.matches
      });
      this.storage = new Hipbone.Storage;
      this.identityMap = new Hipbone.IdentityMap;
      this.initializeAccessor({
        accessorsName: "attributes",
        accessors: options.attributes
      });
      this.initializeAjax(options.host, options.headers);
      this.initialize(options);
      ref = this.initializers;
      for (i = 0, len = ref.length; i < len; i++) {
        initializer = ref[i];
        initializer.apply(this, [options]);
      }
    }

    Application.prototype.initialize = function() {};

    Application.prototype.run = function() {
      return this.trigger('run');
    };

    return Application;

  })(Hipbone.Module);

}).call(this);
