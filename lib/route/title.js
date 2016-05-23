(function() {
  module.exports = {
    initializeTitle: function(titleRoot) {
      if (titleRoot == null) {
        titleRoot = "";
      }
      return this.titleRoot || (this.titleRoot = titleRoot);
    },
    subtitle: function() {
      return "";
    },
    title: function() {
      var subtitle;
      subtitle = this.subtitle();
      if (subtitle.trim() === "") {
        return this.titleRoot;
      } else {
        return subtitle + " - " + this.titleRoot;
      }
    },
    renderTitle: function() {
      return document.title = this.title();
    }
  };

}).call(this);
