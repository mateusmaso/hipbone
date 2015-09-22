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

    @on("add", @incrementCounter)
    @on("remove", @decrementCounter)
    @on("destroy", @decrementCounter)

  incrementPagination: ->
    @offset = @offset + @limit

  decrementPagination: ->
    @offset = @offset - @limit

  paginate: (options={}) ->
    @incrementPagination()
    @fetch(_.extend(remove: false, paginate: true, options))

  hasMore: ->
    @length < @getPaginationCount()

  getPaginationCount: ->
    @meta.get('count') || 0

  incrementCounter: (model, collection, options={}) ->
    @meta.set(count: @meta.get("count") + 1) if @meta.has("count") and not options.parse

  decrementCounter: (model, collection, options={}) ->
    @meta.set(count: @meta.get("count") - 1) if @meta.has("count") and not options.parse
