IdentityMap = require "./../identity_map"

module.exports =

  included: ->
    @identityMap = @::identityMap ||= new IdentityMap

  registered: ->
    @::hashName = _.string.dasherize(@::moduleName).substring(1)

  initializeStore: (params={}, options={}) ->
    hashes = @hashes(params, options)
    hashes = _.without(hashes, options.pathname) if @identityMap.find(options.pathname) and not options.popstate

    if route = @identityMap.findAll(hashes)[0]
      route.set(route.parse(params))
      route
    else
      @store(hashes)
      return null

  storeChanges: ->
    @on("change", => @store())
    @store()

  hashes: (params={}, options={}) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push(options.pathname)
    hashes

  store: (hashes) ->
    hashes ||= @hashes(@params.attributes)
    @identityMap.storeAll(hashes, this)
