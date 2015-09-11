module.exports =

  initializeViews: (views={}) ->
    @views = _.extend({}, @views, views)

    for name, method of _.pick(@constructor, _.functions(@constructor))
      @views[name] = method if method.prototype instanceof Hipbone.View
