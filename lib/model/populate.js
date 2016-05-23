(function() {
  var $;

  $ = require("jquery");

  module.exports = {
    initializePopulate: function() {
      return this.deferreds = {};
    },
    populated: function(name) {
      if (name) {
        return this.syncs[name];
      } else {
        return this.synced;
      }
    },
    populate: function(name) {
      return this.fetch();
    },
    prepare: function(name) {
      var deferred;
      deferred = this.deferreds[name];
      if (deferred && !deferred.state() !== "resolved") {
        return deferred;
      } else {
        return this.deferreds[name] = $.when(this.populated(name) || this.populate(name));
      }
    }
  };

}).call(this);
