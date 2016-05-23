(function() {
  var $;

  $ = require("jquery");

  module.exports = {
    initializePopulate: function() {
      this.deferreds = {};
      this.background || (this.background = false);
      this.defaults || (this.defaults = {});
      this.defaults.loading = false;
      this.internals || (this.internals = []);
      return this.internals.push("loading");
    },
    populated: function(name) {
      return false;
    },
    populate: function(name) {
      return $.when(true);
    },
    prepare: function(name) {
      var deferred, populated;
      deferred = this.deferreds[name];
      if (deferred && deferred.state() !== "resolved") {
        return deferred;
      } else {
        populated = this.populated(name);
        if (!populated) {
          this.set({
            loading: true
          });
        }
        if (this.background) {
          populated = false;
        }
        return this.deferreds[name] = $.when(populated || this.populate(name)).done((function(_this) {
          return function() {
            return _this.set({
              loading: false
            });
          };
        })(this));
      }
    }
  };

}).call(this);
