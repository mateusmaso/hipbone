(function() {
  var $;

  $ = require("jquery");

  module.exports = {
    initializePopulate: function() {
      return this.deferreds = {};
    },
    populated: function(name) {
      return false;
    },
    populate: function(name) {
      return $.when(true);
    },
    prepare: function(name) {
      var deferred;
      deferred = this.deferreds[name];
      if (deferred && deferred.state() !== "resolved") {
        return deferred;
      } else {
        return this.deferreds[name] = $.when(this.populated(name) || this.populate(name));
      }
    }
  };

}).call(this);
