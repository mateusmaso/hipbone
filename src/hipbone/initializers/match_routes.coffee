Hipbone.Application::initializers.push ->

  for route in _.keys(@routes).reverse()
    @router.match(route, @routes[route]) 
