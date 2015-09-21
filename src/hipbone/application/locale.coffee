I18n = require "./../i18n"

module.exports =

  initializeLocale: (locale="en") ->
    @locale ||= locale
    @locales ||= {}
    @i18n = new I18n(@locale, @locales)
