Module = require "./module"

module.exports = class I18n extends Module

  constructor: (locale, locales={}, splitter) ->
    @locale = locale
    @locales = locales
    @splitter = splitter || /{{\w+}}/g

  interpolate: (text, values={}) ->
    for match in text.match(@splitter) || []
      value = values[match.replace(/\W/g, "")]
      text = text.replace(match, value)
    text

  pluralize: (key, count) ->
    if count is 0
      key = "#{key}.zero"
    else if count is 1
      key = "#{key}.one"
    else
      key = "#{key}.other"

    _.path(@locales[@locale], key)

  inflector: (key, gender) ->
    if gender is 'm'
      key = "#{key}.male"
    else if gender is 'f'
      key = "#{key}.female"
    else
      key = "#{key}.neutral"

    _.path(@locales[@locale], key)

  translate: (key, options={}) ->
    if _.has(options, 'count')
      text = @pluralize(key, options.count)
    else if _.has(options, 'gender')
      text = @inflector(key, options.gender)
    else
      text = _.path(@locales[@locale], key)

    @interpolate(text, options)

  t: @::translate

  @register "I18n"
