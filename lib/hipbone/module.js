(function() {
  var i, len, module, ref,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Hipbone.Module = (function() {
    var moduleKeywords;

    function Module() {}

    moduleKeywords = ['included', 'extended'];

    Module.include = function() {
      var i, len, method, module, modules, name, results;
      modules = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      results = [];
      for (i = 0, len = modules.length; i < len; i++) {
        module = modules[i];
        for (name in module) {
          method = module[name];
          if (indexOf.call(moduleKeywords, name) < 0) {
            this.prototype[name] = method;
          }
        }
        if (module.included) {
          results.push(module.included.apply(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Module.extend = function() {
      var i, len, method, module, modules, name, results;
      modules = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      results = [];
      for (i = 0, len = modules.length; i < len; i++) {
        module = modules[i];
        for (name in module) {
          method = module[name];
          if (indexOf.call(moduleKeywords, name) < 0) {
            this[name] = method;
          }
        }
        if (module.extended) {
          results.push(module.extended.apply(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Module;

  })();

  ref = ['Model', 'Collection', 'Router', 'View', 'History'];
  for (i = 0, len = ref.length; i < len; i++) {
    module = ref[i];
    Backbone[module] = _.extend(Backbone[module], Hipbone.Module);
    Backbone[module].prototype = _.extend(Backbone[module].prototype, Hipbone.Module.prototype);
  }

}).call(this);
