module.exports =

  initializePagination: ->
    @pagination ||= {}
    @limit = @pagination.limit || 0
    @offset = @pagination.offset || 0

    @filters ||= {}
    @filters.limit = (options={}) ->
      if @limit > 0
        if options.paginate
          @limit
        else
          @limit + @offset
    @filters.offset = (options={}) ->
      if @limit > 0
        if options.paginate then @offset else 0

  incrementPagination: ->
    @offset = @offset + @limit

  decrementPagination: ->
    @offset = @offset - @limit

  paginate: (options={}) ->
    @incrementPagination()
    @fetch(_.extend(remove: false, paginate: true, options))

  hasMore: ->
    @length < (@meta.get(@countAttribute) || 0)
