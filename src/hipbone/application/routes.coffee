module.exports =

  initializeRoutes: (routes={}) ->
    @routes =  _.extend({}, @routes, routes)

    for name, method of _.pick(@constructor, _.functions(@constructor))
      @routes[name] = method if method.prototype instanceof Hipbone.Route
