Skull.parse = (value) ->
  try
    JSON.parse(value)
  catch error
    value

Skull.path = (context, key) ->
  paths = key.split('.')
  object = context[paths.shift()]
  object = object[path] for path in paths
  object

Skull.decode = (string) -> 
  decodeURIComponent(string.replace(/\+/g, " "))

Skull.instance = (object) ->
  if object and object.type? and object.hash?
    object = (Skull.app.models[object.type] || Skull.app.collections[object.type]).find(object.hash)
  object
