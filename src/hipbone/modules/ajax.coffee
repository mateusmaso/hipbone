Hipbone.Ajax = 
  
  ajax: (options={}) ->
    @ajaxHandle($.ajax(@ajaxSettings(options)))

  ajaxHandle: (xhr) ->
    xhr.done => Hipbone.app.trigger("ajaxSuccess", arguments...)
    xhr.fail => Hipbone.app.trigger("ajaxError", arguments...)
    xhr
  
  ajaxSettings: (options={}) ->
    options.url = Hipbone.app.host + options.url

    if options.type is 'POST'
      options.dataType = 'json'
      options.contentType = 'application/json'
      options.data = JSON.stringify(options.data)

    options.headers ||= {}
    for header, value of Hipbone.app.headers
      value = value.apply(Hipbone.app) if _.isFunction(value)
      options.headers[header] = value

    options.beforeSend = _.catenate ((xhr, settings={}) ->
      xhr.settings = settings
    ), options.beforeSend

    options