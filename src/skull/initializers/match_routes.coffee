Skull.Application::initializers.matchRoutes = ->

  for route in _.keys(Skull.app.routes).reverse()
    Skull.app.router.match(route, Skull.app.routes[route]) 
