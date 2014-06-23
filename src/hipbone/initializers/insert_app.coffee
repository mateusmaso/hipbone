Hipbone.Application::initializers.push ->

  @on "run", =>
    $(@root).prepend(@appView.el)
