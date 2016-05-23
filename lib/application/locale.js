(function() {
  var I18n;

  I18n = require("./../i18n");

  module.exports = {
    initializeLocale: function(locale) {
      if (locale == null) {
        locale = "en";
      }
      this.locale || (this.locale = locale);
      this.locales || (this.locales = {});
      return this.i18n = new I18n(this.locale, this.locales);
    }
  };

}).call(this);
