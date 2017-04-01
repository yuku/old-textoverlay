"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * textoverlay.js - Simple decorator for textarea elements
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Yuku Takahashi <taka84u9@gmil.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _flatten = require("./utils/flatten");

var _flatten2 = _interopRequireDefault(_flatten);

var _setStyle = require("./utils/setStyle");

var _setStyle2 = _interopRequireDefault(_setStyle);

var _getStyle = require("./utils/getStyle");

var _getStyle2 = _interopRequireDefault(_getStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var css = {
  wrapper: {
    "box-sizing": "border-box",
    margin: "0px",
    padding: "0px",
    overflow: "hidden"
  },
  overlay: {
    "box-sizing": "border-box",
    color: "transparent",
    position: "absolute",
    "white-space": "pre-wrap",
    "word-wrap": "break-word",
    overflow: "hidden",
    top: "0px",
    width: "100%"
  },
  textarea: {
    background: "transparent",
    "box-sizing": "border-box",
    outline: "none",
    position: "relative",
    height: "100%"
  }
};

var properties = {
  wrapper: ["display"],
  wrapperSize: ["height", "width"],
  overlay: ["background-color", "font-family", "font-size", "font-weight", "line-height", "margin-bottom", "margin-left", "margin-right", "margin-top", "padding-bottom", "padding-left", "padding-right", "padding-top"],
  overlayBorder: ["border-bottom-width", "border-left-width", "border-right-width", "border-top-width"]
};

function merge(base, target) {
  properties.overlayBorder.forEach(function (property) {
    var borderWidth = parseInt(target[property], 10);
    var match = property.match(/top|bottom|left|right/);
    if (match) {
      var padding = "padding-" + match[0];
      var paddingWidth = parseInt(base[padding], 10);
      base[padding] = paddingWidth + borderWidth + "px";
    }
  });
  return base;
}

var Textoverlay = function () {
  _createClass(Textoverlay, null, [{
    key: "createWrapper",
    value: function createWrapper(textarea, parentElement) {
      var position = (0, _getStyle2.default)(textarea, ["position"]).position;
      var wrapper = document.createElement("div");
      wrapper.className = "textoverlay-wrapper";
      (0, _setStyle2.default)(wrapper, Object.assign({}, (0, _getStyle2.default)(textarea, properties.wrapper), css.wrapper, {
        position: position === "static" ? "relative" : position
      }));
      parentElement.insertBefore(wrapper, textarea);
      parentElement.removeChild(textarea);
      wrapper.appendChild(textarea);
      return wrapper;
    }
  }, {
    key: "createOverlay",
    value: function createOverlay(textarea, wrapper) {
      var overlay = document.createElement("div");
      overlay.className = "textoverlay";
      var borders = (0, _getStyle2.default)(textarea, properties.overlayBorder);

      (0, _setStyle2.default)(overlay, Object.assign({}, css.overlay, merge((0, _getStyle2.default)(textarea, properties.overlay), borders)));
      wrapper.insertBefore(overlay, textarea);
      return overlay;
    }
  }]);

  function Textoverlay(textarea, strategies) {
    _classCallCheck(this, Textoverlay);

    var parentElement = textarea.parentElement;
    if (!parentElement) {
      throw new Error("textarea must in DOM tree");
    }

    this.origStyle = (0, _getStyle2.default)(textarea, Object.keys(css.textarea));

    this.wrapper = Textoverlay.createWrapper(textarea, parentElement);
    this.overlay = Textoverlay.createOverlay(textarea, this.wrapper);

    (0, _setStyle2.default)(textarea, css.textarea);
    this.textarea = textarea;

    this.strategies = strategies;
    this.textareaBorderTop = parseInt((0, _getStyle2.default)(textarea, ["border-top-width"])["border-top-width"], 10);

    this.handleInput = this.handleInput.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.textarea.addEventListener("input", this.handleInput);
    this.textarea.addEventListener("scroll", this.handleScroll);
    this.observer = new MutationObserver(this.handleResize);
    this.observer.observe(this.textarea, {
      attributes: true,
      attributeFilter: ["style"]
    });

    this.render();
  }

  _createClass(Textoverlay, [{
    key: "destroy",
    value: function destroy() {
      this.textarea.removeEventListener("input", this.handleInput);
      this.textarea.removeEventListener("scroll", this.handleScroll);
      this.observer.disconnect();

      (0, _setStyle2.default)(this.textarea, this.origStyle);

      this.overlay.remove();
      this.textarea.remove();
      var parentElement = this.wrapper.parentElement;
      if (parentElement) {
        parentElement.insertBefore(this.textarea, this.wrapper);
        this.wrapper.remove();
      }
    }

    /**
     * Public API to update and sync textoverlay
     */

  }, {
    key: "render",
    value: function render() {
      var skipUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!skipUpdate) {
        this.update();
      }
      this.sync();
    }

    /**
     * Update contents of textoverlay
     */

  }, {
    key: "update",
    value: function update() {
      var _this = this;

      var nodes = this.strategies.reduce(function (ns, strategy) {
        var highlight = document.createElement("span");
        (0, _setStyle2.default)(highlight, strategy.css);
        return (0, _flatten2.default)(ns.map(function (node) {
          if (!(node instanceof Text)) {
            return node;
          }
          var text = node.textContent;
          var resp = [];
          for (var prevIndex = strategy.match.lastIndex = 0;; prevIndex = strategy.match.lastIndex) {
            var _match = strategy.match.exec(text);
            if (!_match) {
              resp.push(new Text(text.substr(prevIndex)));
              break;
            }
            var str = _match[0];
            resp.push(new Text(text.substr(prevIndex, strategy.match.lastIndex - prevIndex - str.length)));
            var span = highlight.cloneNode();
            span.textContent = str;
            resp.push(span);
          }
          return resp;
        }));
      }, [new Text(this.textarea.value)]);

      // Remove all child nodes from overlay.
      while (this.overlay.firstChild) {
        this.overlay.removeChild(this.overlay.firstChild);
      }

      nodes.forEach(function (node) {
        return _this.overlay.appendChild(node);
      });
    }

    /**
     * Sync scroll and size of textarea
     */

  }, {
    key: "sync",
    value: function sync() {
      (0, _setStyle2.default)(this.overlay, {
        top: this.textareaBorderTop - this.textarea.scrollTop + "px"
      });
      (0, _setStyle2.default)(this.wrapper, (0, _getStyle2.default)(this.textarea, properties.wrapperSize));
    }
  }, {
    key: "handleInput",
    value: function handleInput() {
      this.render();
    }
  }, {
    key: "handleScroll",
    value: function handleScroll() {
      this.render(true);
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      this.render(true);
    }
  }]);

  return Textoverlay;
}();

exports.default = Textoverlay;
//# sourceMappingURL=textoverlay.js.map