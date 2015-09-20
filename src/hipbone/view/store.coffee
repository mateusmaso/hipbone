IdentityMap = require "./../identity_map"

module.exports =

  included: ->
    @::identityMap ||= new IdentityMap

  registered: ->
    @::hashName = _.string.dasherize(@::moduleName).substring(1)

  initializeStore: (properties={}) ->
    hashes = @hashes(properties)

    if view = @identityMap.findAll(hashes)[0]
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
    @identityMap.storeAll(hashes, this)
