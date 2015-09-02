(function() {
  Hipbone.Accessor = {
    initializeAccessor: function(options) {
      var alias, name, name1, name2, name3, name4;
      if (options == null) {
        options = {};
      }
      this.defaults || (this.defaults = {});
      this.accessorName || (this.accessorName = options.accessorName || "");
      this.accessorsName || (this.accessorsName = options.accessorsName || "");
      this.accessorEvent || (this.accessorEvent = options.accessorEvent || "change");
      this.accessors = this[this.accessorsName] = {};
      this.setAccessor(_.defaults({}, options.accessors, this.defaults, options.defaults), {
        silent: true
      });
      if (this.accessorName) {
        alias = _.string.capitalize(this.accessorName);
      } else {
        alias = "";
      }
      this[name = "get" + alias] || (this[name] = this.getAccessor);
      this[name1 = "set" + alias] || (this[name1] = this.setAccessor);
      this[name2 = "unset" + alias] || (this[name2] = this.unsetAccessor);
      this[name3 = "changed" + alias] || (this[name3] = this.changedAccessors);
      return this[name4 = "previous" + alias] || (this[name4] = this.previousAccessor);
    },
    getAccessor: function(accessor) {
      return _.path(this.accessors, accessor);
    },
    setAccessor: function(accessor, value, options) {
      var accessors, i, len, path, paths, ref, ref1;
      if (options == null) {
        options = {};
      }
      if (_.isObject(accessor)) {
        accessors = accessor;
        options = value || {};
      } else {
        accessors = {};
        accessors[accessor] = value;
      }
      this._previousAccessors = _.clone(this.accessors);
      this._changedAccessors = this.changedAccessors(accessors);
      if (!_.isEmpty(this._changedAccessors)) {
        this.accessors = _.pathExtend(this.accessors, this._changedAccessors);
        if (!options.silent) {
          ref = this._changedAccessors;
          for (accessor in ref) {
            value = ref[accessor];
            paths = accessor.split(".");
            ref1 = _.clone(paths).reverse();
            for (i = 0, len = ref1.length; i < len; i++) {
              path = ref1[i];
              accessor = paths.join(".");
              paths.pop();
              this.trigger(this.accessorEvent + ":" + accessor, this, _.path(this._previousAccessors, accessor), options);
            }
          }
          this.trigger(this.accessorEvent, this, accessors, options);
        }
        return delete this._previousAccessors;
      }
    },
    unsetAccessor: function(accessor, options) {
      if (options == null) {
        options = {};
      }
      return this.setAccessor(accessor, void 0, options);
    },
    previousAccessor: function(accessor) {
      if (this._previousAccessors) {
        return this._previousAccessors[accessor];
      }
    },
    changedAccessors: function(accessors) {
      var accessor, changed, value;
      changed = {};
      for (accessor in accessors) {
        value = accessors[accessor];
        if (!_.isEqual(this.getAccessor(accessor), value)) {
          changed[accessor] = value;
        }
      }
      return changed;
    }
  };

}).call(this);
