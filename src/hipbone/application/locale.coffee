module.exports =

  initializeLocale: (locale="en") ->
    @locale ||= locale
    @locales ||= {}
    @i18n = new Hipbone.I18n(@locale, @locales)
