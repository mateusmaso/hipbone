_ = require "underscore"

module.exports =

  initializeClassNameBindings: ->
    @classNameBindings ||= {}

  updateClassNameBindings: ->
    @_classNameBindings ||= {}
    for className, callback of @classNameBindings
      oldValue = @_classNameBindings[className]
      value = @_classNameBindings[className] = callback.apply(this)
      if _.isBoolean(value)
        if value
          @$el.addClass(className)
        else
          @$el.removeClass(className)
      else if value isnt oldValue
        @$el.removeClass(oldValue)
        @$el.addClass(value)
