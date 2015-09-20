IdentityMap = require "./../identity_map"

module.exports =

  included: ->
    @::identityMap ||= new IdentityMap

  registered: ->
    @::hashName = _.string.dasherize(@::moduleName).substring(1)

  initializeStore: (params={}, options={}) ->
    hashes = @hashes(params, options)
    hashes = _.without(hashes, options.path) if @identityMap.find(options.path) and not options.popstate

    if route = @identityMap.findAll(hashes)[0]
      route.set(params)
      route
    else
      @store(hashes)
      return null

  hashes: (params={}, options={}) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push(options.path)
    hashes

  store: (hashes) ->
    hashes ||= @hashes(@params.attributes)
    @identityMap.storeAll(hashes, this)
