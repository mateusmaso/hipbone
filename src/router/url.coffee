$ = require "jquery"

module.exports =

  url: (fragment, params={}) ->
    anchor = $("<a>").attr("href", fragment).get(0)

    if params
      if anchor.search.trim() is ""
        anchor.search += $.param(params)
      else
        anchor.search += "&#{$.param(params)}"

    fragment = anchor.pathname + anchor.search
    fragment
