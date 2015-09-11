TodoMVC::initializers.push ->

  @router.match "completed"
  @router.match "active"
  @router.match "root"
