module.exports =

  initializeTitle: (titleRoot="") ->
    @titleRoot ||= titleRoot

  subtitle: ->
    ""

  title: ->
    subtitle = @subtitle()

    if s.isBlank(subtitle)
      @titleRoot
    else
      "#{subtitle} - #{@titleRoot}"

  renderTitle: ->
    document.title = @title()
