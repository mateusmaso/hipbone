module.exports =

  initializeTitle: (titleRoot="") ->
    @titleRoot ||= titleRoot

  subtitle: ->
    ""

  title: ->
    subtitle = @subtitle()

    if subtitle.trim() is ""
      @titleRoot
    else
      "#{subtitle} - #{@titleRoot}"

  renderTitle: ->
    document.title = @title()
