module.exports =

  initializeStore: (hashName, params={}) ->
    @hashName = hashName || _.string.dasherize(@moduleName).substring(1)
    hashes = @hashes(params)
    path = Hipbone.app.history.location.pathname

    if Hipbone.app.identityMap.find(path) and not Hipbone.app.history.popstate
      hashes = _.without(hashes, path)

    if route = Hipbone.app.identityMap.findAll(hashes)[0]
      route.set(params)
      route
    else
      @store(hashes)
      return null

  hashes: (params={}) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push(Hipbone.app.history.location.pathname)
    hashes

  store: (hashes) ->
    hashes ||= @hashes(@params.attributes)
    Hipbone.app.identityMap.storeAll(hashes, this)
