module.exports =

  initializeSchemes: ->
    @schemes ||= {}

  validateSchemes: (attributes={}) ->
    valid = []
    valid.push(name) for name, schema of @schemes when schema.apply(this, [attributes])
    valid
