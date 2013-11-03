Hipbone.parse = (value) ->
  try
    JSON.parse(value)
  catch error
    value

Hipbone.path = (context, key) ->
  paths = key.split('.')
  object = context[paths.shift()]
  object = object[path] for path in paths
  object

Hipbone.decode = (string) -> 
  decodeURIComponent(string.replace(/\+/g, " "))

Hipbone.instance = (object) ->
  if object and object.type? and object.hash?
    object = (Hipbone.app.models[object.type] || Hipbone.app.collections[object.type]).find(object.hash)
  object
