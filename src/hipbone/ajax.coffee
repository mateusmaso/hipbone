Hipbone.Ajax =

  initializeAjax: (host, headers) ->
    @host ||= host || ''
    @headers ||= headers || {}

  ajax: (options={}) ->
    @ajaxHandle($.ajax(@ajaxSettings(options)))

  ajaxHandle: (xhr) ->
    xhr.done => @trigger("ajaxSuccess", arguments...)
    xhr.fail => @trigger("ajaxError", arguments...)
    xhr

  ajaxSettings: (options={}) ->
    options.url = @host + options.url

    if options.type is 'POST'
      options.dataType = 'json'
      options.contentType = 'application/json'
      options.data = JSON.stringify(options.data)

    options.headers ||= {}
    for header, value of @headers
      value = value.apply(this) if _.isFunction(value)
      options.headers[header] = value

    options.beforeSend = _.catenate (xhr, settings={}) ->
      xhr.settings = settings
    , options.beforeSend

    options
