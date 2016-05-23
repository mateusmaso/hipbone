(function() {
  var _;

  _ = require("underscore");

  module.exports = {
    initializePagination: function() {
      this.pagination || (this.pagination = {});
      this.limit = this.pagination.limit || 0;
      this.offset = this.pagination.offset || 0;
      this.filters || (this.filters = {});
      this.filters.limit = function(options) {
        if (options == null) {
          options = {};
        }
        if (this.limit > 0) {
          if (options.paginate) {
            return this.limit;
          } else {
            return this.limit + this.offset;
          }
        }
      };
      return this.filters.offset = function(options) {
        if (options == null) {
          options = {};
        }
        if (this.limit > 0) {
          if (options.paginate) {
            return this.offset;
          } else {
            return 0;
          }
        }
      };
    },
    incrementPagination: function() {
      return this.offset = this.offset + this.limit;
    },
    decrementPagination: function() {
      return this.offset = this.offset - this.limit;
    },
    paginate: function(options) {
      if (options == null) {
        options = {};
      }
      this.incrementPagination();
      return this.fetch(_.extend({
        remove: false,
        paginate: true
      }, options));
    },
    hasMore: function() {
      return this.length < (this.meta.get(this.countAttribute) || 0);
    }
  };

}).call(this);
