module.exports =

  initializeCollections: (collections={}) ->
    @collections = _.extend({}, @collections, collections)

    for name, method of _.pick(@constructor, _.functions(@constructor))
      @collections[name] = method if method.prototype instanceof Hipbone.Collection
