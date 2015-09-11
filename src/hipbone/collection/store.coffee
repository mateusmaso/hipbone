module.exports =

  initializeStore: (hashName, models, options) ->
    @hashName = hashName || _.string.dasherize(@moduleName).substring(1)
    hashes = @hashes(models, options)

    if collection = Hipbone.app.identityMap.findAll(hashes)[0]
      collection.set(models, options) if models
      collection.meta.set(options.meta) if options.meta
      collection.setParent(options.parent) if options.parent
      collection
    else
      @store(hashes)
      return null

  hashes: (models, options={}) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push("#{@hashName}-#{options.parent.cid}") if options.parent?.cid
    hashes

  store: (hashes) ->
    hashes ||= @hashes(@models, parent: @parent, meta: @meta)
    Hipbone.app.identityMap.storeAll(hashes, this)
