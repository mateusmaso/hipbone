module.exports =

  url: (name, params={}) ->
    @matches[name].toURL(params)

  urlFragment: (fragment, params={}) ->
    fragment = @url(fragment, params) if @matches[fragment]
    anchor = $("<a>").attr("href", fragment).get(0)
    anchor.search = $.param(params) if params
    fragment = anchor.pathname + anchor.search
    fragment
