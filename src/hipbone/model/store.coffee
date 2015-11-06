IdentityMap = require "./../identity_map"

module.exports =

  included: ->
    @identityMap = @::identityMap ||= new IdentityMap

  registered: ->
    @::hashName = _.string.dasherize(@::moduleName).substring(1)

  initializeStore: (attributes={}, options={}) ->
    hashes = @hashes(attributes)

    if model = @identityMap.findAll(hashes)[0]
      model.set(attributes, options)
      model
    else
      @store(hashes)
      return null

  storeChanges: ->
    @on("change", => @store())
    @store()

  hashes: (attributes) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push("#{@hashName}-#{attributes[@idAttribute]}") if attributes[@idAttribute]
    hashes

  store: (hashes) ->
    hashes ||= @hashes(@attributes)
    @identityMap.storeAll(hashes, this)
