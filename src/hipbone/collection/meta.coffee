Model = require "./../model"

class Meta extends Model

  @registerModule "Meta"

module.exports =

  initializeMeta: (meta={}, defaults={}) ->
    Meta::defaults = defaults
    @meta = new Meta(meta)
    @listenTo @meta, "all", (eventName, args...) => @trigger.apply(this, ["meta:#{eventName}", args...])
