(function() {
  module.exports = {
    initializeSyncs: function() {
      return this.syncs || (this.syncs = {});
    },
    unsync: function(name) {
      if (name) {
        delete this.syncs[name];
        return this.trigger("unsync:" + name, this);
      } else {
        delete this.synced;
        return this.trigger("unsync", this);
      }
    },
    didSync: function(name) {
      if (name) {
        this.syncs[name] = this.synced;
        return this.trigger("synced:" + name, this);
      } else {
        this.synced = Date.now();
        return this.trigger("synced", name, this);
      }
    }
  };

}).call(this);
