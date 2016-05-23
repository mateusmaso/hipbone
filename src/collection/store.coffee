dasherize = require "string-dasherize"
IdentityMap = require "./../identity_map"

module.exports =

  included: ->
    @identityMap = @::identityMap ||= new IdentityMap

  registered: ->
    @::hashName = dasherize(@::moduleName || "").substring(1)

  initializeStore: (models, options) ->
    hashes = @hashes(models, options)

    if collection = @identityMap.findAll(hashes)[0]
      collection.set(models, options) if models
      collection.meta.set(options.meta) if options.meta
      collection.setParent(options.parent) if options.parent
      collection
    else
      @store(hashes)
      return null

  storeChanges: ->
    @on("change change:parent meta:change", => @store())
    @store()

  hashes: (models, options={}) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push("#{@hashName}-#{options.parent.cid}") if options.parent?.cid
    hashes

  store: (hashes) ->
    hashes ||= @hashes(@models, parent: @parent, meta: @meta)
    @identityMap.storeAll(hashes, this)
