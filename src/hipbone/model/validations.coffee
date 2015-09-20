module.exports =

  initializeValidations: ->
    @errors = []
    @validations ||= {}

  hasErrors: (attributes=[]) ->
    if _.isEmpty(attributes)
      @errors.length > 0
    else
      _.intersection(@errors, attributes).length > 0

  validate: (attributes={}) ->
    @errors = []
    for attribute, value of attributes
      validation = @validations[attribute]
      if validation and not validation.apply(this, [value, attributes])
        @errors.push(attribute)
    @errors if @hasErrors()
