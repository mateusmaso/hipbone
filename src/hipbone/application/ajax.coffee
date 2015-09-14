module.exports =

  initializeAjax: (host="", headers={}) ->
    @host ||= host
    @headers = _.extend({}, @headers, headers)

  ajax: (options={}) ->
    @ajaxHandle(Backbone.ajax(@ajaxSettings(options)))

  ajaxHandle: (xhr) ->
    xhr.done => @trigger("ajaxSuccess", arguments...)
    xhr.fail => @trigger("ajaxError", arguments...)
    xhr

  ajaxUrl: (url) ->
    "#{@host}#{url}"

  ajaxHeaders: ->
    headers = {}
    for header, value of @headers
      value = value.apply(this) if _.isFunction(value)
      headers[header] = value
    headers

  ajaxSettings: (options={}) ->
    options.url = @ajaxUrl(options.url)
    options.headers = _.extend({}, options.headers, @ajaxHeaders())

    if options.type is 'POST'
      options.dataType = 'json'
      options.contentType = 'application/json'
      options.data = JSON.stringify(options.data)

    options.beforeSend = _.catenate (xhr, settings={}) ->
      xhr.settings = settings
    , options.beforeSend

    options
