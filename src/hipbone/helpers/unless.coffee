Hipbone.Application::helpers['unless'] = (conditional, options) ->

  [options.fn, options.inverse] = [options.inverse, options.fn]
  Hipbone.Application::helpers['if'].apply(@, [conditional, options])
