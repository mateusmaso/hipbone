(function() {
  var $;

  $ = require("jquery");

  module.exports = {
    initializeContent: function(content) {
      this.content = content;
      return this.container || (this.container = void 0);
    },
    setContent: function(content) {
      if (this.content !== content) {
        $(this.content).detach();
        this.content = content;
        return this.renderContent();
      }
    },
    renderContent: function() {
      if (this.content) {
        if (this.container) {
          return this.$(this.container).append(this.content);
        } else {
          return this.$el.append(this.content);
        }
      }
    }
  };

}).call(this);
