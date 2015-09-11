module.exports =

  locales: {}

  initializeLocales: (locale="en", locales={}) ->
    @locale ||= locale
    @locales = _.extend(@locales, locales)
    @i18n = new Hipbone.I18n(@locale, @locales)
