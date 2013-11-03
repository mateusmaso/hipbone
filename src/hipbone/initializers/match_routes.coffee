Hipbone.Application::initializers.matchRoutes = ->

  for route in _.keys(Hipbone.app.routes).reverse()
    Hipbone.app.router.match(route, Hipbone.app.routes[route]) 
