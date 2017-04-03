/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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

var _flatten = __webpack_require__(3);

var _flatten2 = _interopRequireDefault(_flatten);

var _setStyle = __webpack_require__(5);

var _setStyle2 = _interopRequireDefault(_setStyle);

var _getStyle = __webpack_require__(4);

var _getStyle2 = _interopRequireDefault(_getStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var css = {
  wrapper: {
    "box-sizing": "border-box",
    overflow: "hidden"
  },
  overlay: {
    "box-sizing": "border-box",
    "border-color": "transparent",
    "border-style": "solid",
    color: "transparent",
    position: "absolute",
    "white-space": "pre-wrap",
    "word-wrap": "break-word",
    overflow: "hidden",
    width: "100%"
  },
  textarea: {
    background: "transparent",
    "box-sizing": "border-box",
    outline: "none",
    position: "relative",
    height: "100%",
    width: "100%",
    margin: "0px"
  }
};

var properties = {
  wrapper: ["background", "display", "margin"],
  overlay: ["font-family", "font-size", "font-weight", "line-height", "padding", "border-width"]
};

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

      (0, _setStyle2.default)(overlay, Object.assign({}, css.overlay, (0, _getStyle2.default)(textarea, properties.overlay)));
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

    this.wrapperDisplay = (0, _getStyle2.default)(this.wrapper, ["display"])["display"];
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
     *
     * @private
     */

  }, {
    key: "update",
    value: function update() {
      var _this = this;

      // Remove all child nodes from overlay.
      while (this.overlay.firstChild) {
        this.overlay.removeChild(this.overlay.firstChild);
      }

      this.computeOverlayNodes().forEach(function (node) {
        return _this.overlay.appendChild(node);
      });
    }

    /**
     * Sync scroll and size of textarea
     *
     * @private
     */

  }, {
    key: "sync",
    value: function sync() {
      (0, _setStyle2.default)(this.overlay, { top: -this.textarea.scrollTop + "px" });
      var props = this.wrapperDisplay === "block" ? ["height"] : ["height", "width"];
      (0, _setStyle2.default)(this.wrapper, (0, _getStyle2.default)(this.textarea, props));
    }

    /**
     * @private
     */

  }, {
    key: "computeOverlayNodes",
    value: function computeOverlayNodes() {
      return this.strategies.reduce(function (ns, strategy) {
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _textoverlay = __webpack_require__(0);

var _textoverlay2 = _interopRequireDefault(_textoverlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.Textoverlay = _textoverlay2.default;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flatten;


/**
 * Function for flattening a nested array.
 */
function flatten(array) {
  return array.reduce(function (acc, element) {
    if (element instanceof Array) {
      flatten(element).forEach(function (e) {
        return acc.push(e);
      });
    } else {
      acc.push(element);
    }
    return acc;
  }, []);
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getStyle;


/**
 * Get style of the given properties
 */
function getStyle(element, properties) {
  var cssStyleDeclaration = window.getComputedStyle(element);
  return properties.reduce(function (acc, property) {
    acc[property] = cssStyleDeclaration.getPropertyValue(property);
    return acc;
  }, {});
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setStyle;


/**
 * Set style to the element.
 */
function setStyle(element, style) {
  Object.keys(style).forEach(function (key) {
    element.style.setProperty(key, style[key]);
  });
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map