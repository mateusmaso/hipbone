TodoMVC::initializers.push ->

  @router.match "completed", route: TodoMVC.CompletedRoute, url: "completed(/)", toURL: -> "/completed"
  @router.match "active", route: TodoMVC.CompletedRoute, url: "active(/)", toURL: -> "/active"
  @router.match "root", route: TodoMVC.RootRoute, url: "*all", toURL: -> "/"
