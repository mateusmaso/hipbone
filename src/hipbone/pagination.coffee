Hipbone.Pagination =

  initializePagination: (pagination={}) ->
    @pagination = _.extend({}, @pagination, pagination)
    @paginationOffset = @pagination.offset

    @filters ||= {}
    @filters.limit = (options={}) ->
      if @paginationOffset
        if options.paginate
          @pagination.limit
        else
          @pagination.limit + @paginationOffset
    @filters.offset = (options={}) ->
      if @paginationOffset
        if options.paginate then @paginationOffset else 0

  incrementPagination: ->
    @paginationOffset = @pagination.limit + @paginationOffset

  paginate: (options={}) ->
    @incrementPagination()
    @fetch(_.extend(remove: false, paginate: true, options))

  hasMore: ->
    @length < @getPaginationCount()

  getPaginationCount: ->
    @getMeta('count')

  # @on("destroy", @decrementCounter)
  #
  # @on "add", (model, collection, options={}) ->
  #   @setMeta(count: @getMeta("count") + 1) if options.incrementCounter
  #
  # @on "remove", (model, collection, options={}) ->
  #   @setMeta(count: @getMeta("count") - 1) if options.decrementCounter
