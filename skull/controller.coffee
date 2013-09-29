class Skull.Controller extends Skull.Module
  
  @include Backbone.Events
  @include Skull.Station
  @include Skull.Ajax

  @beforeFilter: (callback, options={}) ->
    options.callback = callback
    @beforeFilters = _.clone(@beforeFilters) || []
    @beforeFilters.push(options)

  @afterFilter: (callback, options={}) ->
    options.callback = callback
    @afterFilters = _.clone(@afterFilters) || []
    @afterFilters.push(options)

  constructor: ->
    @initializeStation()
    @initialize()

  initialize: ->

  action: (params, chained) ->
    return if @filter(params, chained, @constructor.beforeFilters).length > 0
    @[params.action](params, chained)
    @filter(params, chained, @constructor.afterFilters)

  filter: (params, chained, filters) ->
    _.filter filters, (filter) =>
      return if filter.only and not _.contains(filter.only, params.action) 
      @[filter.callback](params, chained) is false

  load: (objects...) ->
    deferreds = []
    deferreds.push(object.when()) for object in objects
    $.when(deferreds...)