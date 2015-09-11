module.exports =

  initializeStore: (hashName, properties={}) ->
    @hashName = hashName || _.string.dasherize(@moduleName).substring(1)
    hashes = @hashes(properties)

    if view = Hipbone.app.identityMap.findAll(hashes)[0]
      view.setContent(content)
      view.set(properties)
      view
    else
      @store(hashes)
      return null

  hashes: (properties={}) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes

  store: (hashes) ->
    hashes ||= @hashes()
    Hipbone.app.identityMap.storeAll(hashes, this)
