module.exports =

  initializeStore: (hashName, attributes={}, options={}) ->
    @hashName = hashName || _.string.dasherize(@moduleName).substring(1)
    hashes = @hashes(attributes)

    if model = Hipbone.app.identityMap.findAll(hashes)[0]
      model.set(attributes, options)
      model
    else
      @store(hashes)
      return null

  hashes: (attributes) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push("#{@hashName}-#{attributes[@idAttribute]}") if attributes[@idAttribute]
    hashes

  store: (hashes) ->
    hashes ||= @hashes(@attributes)
    Hipbone.app.identityMap.storeAll(hashes, this)
