module.exports =

  initializeModels: (models={}) ->
    @models = _.extend({}, @models, models)

    for name, method of _.pick(@constructor, _.functions(@constructor))
      @models[name] = method if method.prototype instanceof Hipbone.Model
