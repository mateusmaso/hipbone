(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Hipbone.View = (function(superClass) {
    extend(View, superClass);

    View.include(Hipbone.Accessor);

    View.prototype.hashName = "view";

    View.prototype.elementName = "view";

    function View(properties, content) {
      var hashes, view;
      if (properties == null) {
        properties = {};
      }
      hashes = this.hashes(properties);
      if (view = Hipbone.app.identityMap.findAll(hashes)[0]) {
        view.setContent(content);
        view.set(properties);
        return view;
      } else {
        this.store(hashes);
      }
      this.booleans || (this.booleans = []);
      this.elements || (this.elements = {});
      this.internal = {};
      this.content = content;
      this.classNameBindings || (this.classNameBindings = {});
      this.deferact = _.debounce(this.react);
      this.initializeAccessor({
        accessorsName: "properties",
        accessors: properties
      });
      View.__super__.constructor.apply(this, arguments);
      this.populate();
      this.render();
      this.hooks();
    }

    View.prototype.destroy = function() {};

    View.prototype.insert = function() {};

    View.prototype.detach = function() {};

    View.prototype.change = function(attribute, value) {};

    View.prototype.hooks = function() {
      return this.$el.lifecycle({
        insert: (function(_this) {
          return function() {
            _this.insert();
            return _this.trigger("insert");
          };
        })(this),
        remove: (function(_this) {
          return function() {
            _this.detach();
            return _this.trigger("detach");
          };
        })(this),
        change: (function(_this) {
          return function(attribute, value) {
            _this.change(attribute, value);
            attribute = _.string.camelize(attribute);
            return _this.set(attribute, Handlebars.parseValue(value, _.contains(_this.booleans, attribute)));
          };
        })(this)
      });
    };

    View.prototype.setAccessor = function(accessor, value, options) {
      var ref;
      if (options == null) {
        options = {};
      }
      if (_.isObject(accessor)) {
        options = value || {};
      }
      Hipbone.Accessor.setAccessor.apply(this, arguments);
      if ((ref = this.$el) != null ? ref.is("[lifecycle]") : void 0) {
        this.update(options);
      }
      return this.store();
    };

    View.prototype._ensureElement = function() {
      View.__super__._ensureElement.apply(this, arguments);
      this.set({
        "class": this.el.className + " " + (this.get("class") || '')
      });
      this._setAttributes(this.properties);
      return this.el.hipboneView = this;
    };

    View.prototype.setContent = function(content) {
      if (this.container) {
        this.$(this.container).append(content);
      } else {
        this.$el.append(content);
      }
      return this.content = content;
    };

    View.prototype.setAttribute = function(attribute, value) {
      attribute = _.string.dasherize(attribute);
      if (attribute === "class") {
        return this.$el.addClass(value);
      } else if (_.contains(this.booleans, attribute)) {
        if (value) {
          return this.$el.attr(attribute, '');
        }
      } else if (!_.isObject(value)) {
        return this.$el.attr(attribute, value);
      }
    };

    View.prototype._setAttributes = function(attributes) {
      var attribute, results, value;
      if (attributes == null) {
        attributes = {};
      }
      results = [];
      for (attribute in attributes) {
        value = attributes[attribute];
        results.push(this.setAttribute(attribute, value));
      }
      return results;
    };

    View.prototype.$ = function(selector) {
      return View.__super__.$.call(this, this.elements[selector] || selector);
    };

    View.prototype.$view = function(selector) {
      if (this.$(selector)[0]) {
        return this.$(selector)[0].hipboneView;
      }
    };

    View.prototype.fetch = function() {};

    View.prototype.synced = function() {};

    View.prototype.populate = function() {
      if (!this.synced()) {
        this.set({
          loading: true
        });
      }
      return this.prepare().done((function(_this) {
        return function() {
          return _this.set({
            loading: false
          });
        };
      })(this));
    };

    View.prototype.prepare = function() {
      if (this.background) {
        return this.fetch();
      } else {
        return $.when(this.synced() || this.fetch());
      }
    };

    View.prototype.context = function() {};

    View.prototype.update = function(options) {
      if (options == null) {
        options = {};
      }
      this.merge(this.present(this.context()));
      if (options.immediate || Object.observe) {
        return this.react();
      } else {
        return this.deferact();
      }
    };

    View.prototype.render = function() {
      this.merge(this.present(this.context()));
      if (this.templateName) {
        this.$el.html(this.template(this.templateName));
      }
      if (this.content) {
        return this.setContent(this.content);
      }
    };

    View.prototype.template = function(path, context) {
      path = Hipbone.app.templatePath + path;
      context = _.isEmpty(context) ? this.internal : this.present(context);
      return $(Handlebars.parseHTML(Hipbone.app.templates[path](context)));
    };

    View.prototype.context = function() {};

    View.prototype.present = function(context) {
      var key, ref, value;
      if (context == null) {
        context = {};
      }
      ref = context = _.defaults(context, this.properties);
      for (key in ref) {
        value = ref[key];
        if (value instanceof Hipbone.Model || value instanceof Hipbone.Collection) {
          context[key] = value.toJSON();
        }
      }
      return context;
    };

    View.prototype.delegate = function(eventName, selector, listener) {
      selector = this.elements[selector] || selector;
      return View.__super__.delegate.call(this, eventName, selector, listener);
    };

    View.prototype.bubble = function() {
      var args, eventName;
      eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this.trigger.apply(this, arguments);
      return this.$el.trigger(eventName, args);
    };

    View.prototype.remove = function() {
      this.destroy();
      return View.__super__.remove.apply(this, arguments);
    };

    View.prototype.hashes = function(properties) {
      var hashes;
      if (properties == null) {
        properties = {};
      }
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      return hashes;
    };

    View.prototype.react = function() {
      var callback, className, oldValue, ref, value;
      this._classNameBindings || (this._classNameBindings = {});
      ref = this.classNameBindings;
      for (className in ref) {
        callback = ref[className];
        oldValue = this._classNameBindings[className];
        value = this._classNameBindings[className] = callback.apply(this);
        if (_.isBoolean(value)) {
          if (value) {
            this.$el.addClass(className);
          } else {
            this.$el.removeClass(className);
          }
        } else if (value !== oldValue) {
          this.$el.removeClass(oldValue);
          this.$el.addClass(value);
        }
      }
      return Platform.performMicrotaskCheckpoint();
    };

    View.prototype.merge = function(context) {
      jsondiffpatch.config.objectHash = function(object) {
        return (object != null ? object.cid : void 0) || object;
      };
      return jsondiffpatch.patch(this.internal, jsondiffpatch.diff(this.internal, context));
    };

    View.prototype.store = function(hashes) {
      hashes || (hashes = this.hashes());
      return Hipbone.app.identityMap.storeAll(hashes, this);
    };

    return View;

  })(Backbone.View);

}).call(this);
