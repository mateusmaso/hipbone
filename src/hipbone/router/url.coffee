module.exports =

  url: (name, params) ->
    Hipbone.app.routes[@matches[name]]::toURL(params)

  urlFragment: (fragment, params) ->
    fragment = @url(fragment, options.params) if @matches[fragment]
    anchor = $("<a>").attr("href", fragment).get(0)
    anchor.search = $.param(options.params) if options.params
    fragment = anchor.pathname + anchor.search
    fragment
