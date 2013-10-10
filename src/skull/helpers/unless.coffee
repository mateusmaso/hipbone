Skull.Application::helpers['unless'] = (conditional, options) ->

  [options.fn, options.inverse] = [options.inverse, options.fn]
  Skull.Application::helpers['if'].apply(@, [conditional, options])
