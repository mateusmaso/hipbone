(function() {
  var $, currentElement;

  $ = require("jquery");

  currentElement = void 0;

  module.exports = {
    initializeElement: function(elementRoot) {
      return this.elementRoot || (this.elementRoot = elementRoot || document.body);
    },
    element: function() {},
    renderElement: function() {
      this._element || (this._element = this.element());
      if (currentElement !== this._element) {
        $(currentElement).detach();
        if (this.elementRoot.hipboneView) {
          this.elementRoot.hipboneView.setContent(this._element);
        } else {
          $(this.elementRoot).append(this._element);
        }
        return currentElement = this._element;
      }
    }
  };

}).call(this);
