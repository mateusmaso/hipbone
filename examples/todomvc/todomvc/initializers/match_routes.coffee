TodoMVC::initializers.push ->

  @router.match "completed(/)",
    route: TodoMVC.CompletedRoute
    name: "completed"
    url: "/completed"

  @router.match "active(/)",
    route: TodoMVC.CompletedRoute
    name: "active"
    url: "/active"

  @router.match "*all",
    route: TodoMVC.RootRoute
    url: "/"
