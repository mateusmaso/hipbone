module.exports =

  url: (fragment, params={}) ->
    anchor = $("<a>").attr("href", fragment).get(0)
    anchor.search = $.param(params) if params
    fragment = anchor.pathname + anchor.search
    fragment
