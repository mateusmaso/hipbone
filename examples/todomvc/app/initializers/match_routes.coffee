CompletedRoute = require "../routes/completed_route"
ActiveRoute = require "../routes/active_route"
RootRoute = require "../routes/root_route"

module.exports = ->

  @router.match "completed(/)",
    route: CompletedRoute
    name: "completed"
    url: "/completed"

  @router.match "active(/)",
    route: ActiveRoute
    name: "active"
    url: "/active"

  @router.match "*all",
    route: RootRoute
    url: "/"
