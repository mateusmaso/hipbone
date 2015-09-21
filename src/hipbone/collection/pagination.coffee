module.exports =

  initializePagination: ->
    @pagination ||= {}
    @paginationOffset = @pagination.offset

    @filters ||= {}
    @filters.limit = (options={}) ->
      if @paginationOffset?
        if options.paginate
          @pagination.limit
        else
          @pagination.limit + @paginationOffset
    @filters.offset = (options={}) ->
      if @paginationOffset?
        if options.paginate then @paginationOffset else 0

    @on("add", @incrementCounter)
    @on("remove", @decrementCounter)
    @on("destroy", @decrementCounter)

  incrementPagination: ->
    @paginationOffset = @paginationOffset + @pagination.limit

  decrementPagination: ->
    @paginationOffset = @paginationOffset - @pagination.limit

  paginate: (options={}) ->
    @incrementPagination()
    @fetch(_.extend(remove: false, paginate: true, options))

  hasMore: ->
    @length < @getPaginationCount()

  getPaginationCount: ->
    @meta.get('count')

  incrementCounter: (model, collection, options={}) ->
    @meta.set(count: @meta.get("count") + 1) if @meta.has("count") and not options.parse

  decrementCounter: (model, collection, options={}) ->
    @meta.set(count: @meta.get("count") - 1) if @meta.has("count")  and not options.parse
