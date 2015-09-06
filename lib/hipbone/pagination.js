(function() {
  Hipbone.Pagination = {
    initializePagination: function(pagination) {
      if (pagination == null) {
        pagination = {};
      }
      this.pagination = _.extend({}, this.pagination, pagination);
      this.paginationOffset = this.pagination.offset;
      this.filters || (this.filters = {});
      this.filters.limit = function(options) {
        if (options == null) {
          options = {};
        }
        if (this.paginationOffset) {
          if (options.paginate) {
            return this.pagination.limit;
          } else {
            return this.pagination.limit + this.paginationOffset;
          }
        }
      };
      return this.filters.offset = function(options) {
        if (options == null) {
          options = {};
        }
        if (this.paginationOffset) {
          if (options.paginate) {
            return this.paginationOffset;
          } else {
            return 0;
          }
        }
      };
    },
    incrementPagination: function() {
      return this.paginationOffset = this.pagination.limit + this.paginationOffset;
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
      return this.length < this.getPaginationCount();
    },
    getPaginationCount: function() {
      return this.getMeta('count');
    }
  };

}).call(this);
