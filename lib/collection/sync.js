(function() {
  module.exports = {
    unsync: function() {
      delete this.synced;
      return this.trigger("unsync", this);
    },
    didSync: function() {
      this.synced = Date.now();
      return this.trigger("synced", name, this);
    }
  };

}).call(this);
