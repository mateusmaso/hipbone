class Hipbone.I18n extends Hipbone.Module
  
  constructor: (locale, splitter) ->
    @locale = locale
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
    
    Hipbone.path(@locale, key)

  inflector: (key, gender) ->
    if gender is 'm'
      key = "#{key}.male"
    else if gender is 'f'
      key = "#{key}.female"
    else
      key = "#{key}.neutral"

    Hipbone.path(@locale, key)
    
  translate: (key, options={}) ->
    if _.has(options, 'count')
      text = @pluralize(key, options.count)
    else if _.has(options, 'gender')
      text = @inflector(key, options.gender)
    else
      text = Hipbone.path(@locale, key)
    
    @interpolate(text, options) 

  t: @::translate