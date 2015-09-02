(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    var Collection, Model, Route, View, booleans, key, method, name, ref, ref1, ref2, ref3, ref4, ref5, ref6, results, setReflection, value;
    setReflection = function(Module, attribute, value) {
      if ((Module.prototype[attribute] == null) || _.isEqual(Module.__super__[attribute], Module.prototype[attribute])) {
        return Module.prototype[attribute] = value;
      }
    };
    ref = _.pick(this.constructor, _.functions(this.constructor));
    for (name in ref) {
      method = ref[name];
      if (method.prototype instanceof Hipbone.View) {
        this.views[name] = method;
      }
      if (method.prototype instanceof Hipbone.Model) {
        this.models[name] = method;
      }
      if (method.prototype instanceof Hipbone.Route) {
        this.routes[name] = method;
      }
      if (method.prototype instanceof Hipbone.Collection) {
        this.collections[name] = method;
      }
    }
    ref1 = this.routes;
    for (name in ref1) {
      Route = ref1[name];
      setReflection(Route, "hashName", _.string.dasherize(name).substring(1));
    }
    ref2 = this.views;
    for (name in ref2) {
      View = ref2[name];
      setReflection(View, "hashName", _.string.dasherize(name).substring(1));
    }
    ref3 = this.models;
    for (name in ref3) {
      Model = ref3[name];
      Model.prototype.defaults = _.extend({}, _.clone(Model.prototype.defaults), {
        type: name
      });
      setReflection(Model, "hashName", _.string.dasherize(name).substring(1));
    }
    ref4 = this.collections;
    for (name in ref4) {
      Collection = ref4[name];
      setReflection(Collection, "hashName", _.string.dasherize(name).substring(1));
    }
    ref5 = this.views;
    results = [];
    for (name in ref5) {
      View = ref5[name];
      booleans = [];
      ref6 = View.prototype.defaults;
      for (key in ref6) {
        value = ref6[key];
        if (_.isBoolean(value)) {
          booleans.push(key);
        }
      }
      setReflection(View, "booleans", booleans);
      results.push(setReflection(View, "elementName", _.string.dasherize(name).substring(1).replace("-view", "")));
    }
    return results;
  });

}).call(this);
