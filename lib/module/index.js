(function() {
  var Backbone, Module, _, keywords, prepare, store,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require("underscore");

  Backbone = require("backbone");

  store = {};

  keywords = ['included', 'extended'];

  prepare = function(module) {
    var cid, superclass;
    superclass = module.__super__.constructor;
    cid = _.uniqueId("module");
    store[cid] = module;
    module.cid = cid;
    module.subclasses = [];
    module.includedModules = _.clone(superclass.includedModules || []);
    module.extendedModules = _.clone(superclass.extendedModules || []);
    if (superclass.subclasses) {
      return superclass.subclasses.push(module);
    }
  };

  module.exports = Module = (function() {
    function Module() {}

    Module.prototype.moduleName = "Module";

    Module.register = function(name) {
      var i, j, len, len1, module, ref, ref1, results;
      if (store[this.cid] !== this) {
        prepare(this);
      }
      this.prototype.moduleName = name;
      ref = this.includedModules;
      for (i = 0, len = ref.length; i < len; i++) {
        module = ref[i];
        if (module.registered) {
          module.registered.apply(this);
        }
      }
      ref1 = this.extendedModules;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        module = ref1[j];
        if (module.registered) {
          results.push(module.registered.apply(this));
        }
      }
      return results;
    };

    Module.include = function() {
      var i, len, method, module, modules, name, results;
      modules = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (store[this.cid] !== this) {
        prepare(this);
      }
      results = [];
      for (i = 0, len = modules.length; i < len; i++) {
        module = modules[i];
        this.includedModules.push(module);
        for (name in module) {
          method = module[name];
          if (indexOf.call(keywords, name) < 0) {
            this.prototype[name] = method;
          }
        }
        if (module.included) {
          module.included.apply(this);
        }
        if (module.registered) {
          results.push(module.registered.apply(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Module.extend = function() {
      var i, len, method, module, modules, name, results;
      modules = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (store[this.cid] !== this) {
        prepare(this);
      }
      results = [];
      for (i = 0, len = modules.length; i < len; i++) {
        module = modules[i];
        this.extendedModules.push(module);
        for (name in module) {
          method = module[name];
          if (indexOf.call(keywords, name) < 0) {
            this[name] = method;
          }
        }
        if (module.extended) {
          module.extended.apply(this);
        }
        if (module.registered) {
          results.push(module.registered.apply(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Module.define = Backbone.Model.extend;

    return Module;

  })();

}).call(this);
