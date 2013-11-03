Hipbone.Validation =

  initializeValidation: (validations={})->    
    @validations = _.extend({}, @validations, validations)
    @errors = []
  
  hasErrors: ->
    @errors.length > 0

  validate: (attributes={}) ->
    @errors = []
    for attribute, value of attributes
      validation = @validations[attribute]
      if validation and not validation.apply(@, [value, attributes])
        @errors.push(attribute)
    @errors if @hasErrors()