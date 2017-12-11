(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Textoverlay"] = factory();
	else
		root["Textoverlay"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * textoverlay.js - Simple decorator for textarea elements
 *
 * @author Yuku Takahashi <taka84u9@gmail.com>
 */
var css = {
    wrapper: {
        'box-sizing': 'border-box',
        'overflow': 'hidden'
    },
    overlay: {
        'box-sizing': 'border-box',
        'border-color': 'transparent',
        'border-style': 'solid',
        'color': 'transparent',
        'position': 'absolute',
        'white-space': 'pre-wrap',
        'word-wrap': 'break-word',
        'overflow': 'hidden',
        'width': '100%'
    },
    textarea: {
        'background': 'transparent',
        'box-sizing': 'border-box',
        'outline': 'none',
        'position': 'relative',
        'height': '100%',
        'width': '100%',
        'margin': '0px'
    }
};
// Firefox does not provide shorthand properties in getComputedStyle, so we use
// the expanded ones here.
var properties = {
    wrapper: ['background-attachment', 'background-blend-mode', 'background-clip', 'background-color', 'background-image', 'background-origin', 'background-position', 'background-position-x', 'background-position-y', 'background-repeat', 'background-size', 'display', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
    overlay: ['font-family', 'font-size', 'font-weight', 'line-height', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width']
};

var Textoverlay = function () {
    function Textoverlay(textarea, strategies) {
        var _this = this;

        _classCallCheck(this, Textoverlay);

        if (!textarea.parentElement) {
            throw new Error('textarea must be in the DOM tree');
        }
        this.textarea = textarea;
        this.textareaStyle = window.getComputedStyle(textarea);
        this.createWrapper();
        this.createOverlay();
        this.textareaStyleWas = {};
        Object.keys(css.textarea).forEach(function (key) {
            _this.textareaStyleWas[key] = _this.textarea.style.getPropertyValue(key);
        });
        setStyle(this.textarea, css.textarea);
        this.strategies = strategies;
        this.handleInput = this.handleInput.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.textarea.addEventListener('input', this.handleInput);
        this.textarea.addEventListener('scroll', this.handleScroll);
        this.observer = new MutationObserver(this.handleResize);
        this.observer.observe(this.textarea, {
            attributes: true,
            attributeFilter: ['style']
        });
        this.wrapperDisplay = this.wrapper.style.display || '';
        this.render();
    }

    _createClass(Textoverlay, [{
        key: 'destroy',
        value: function destroy() {
            this.textarea.removeEventListener('input', this.handleInput);
            this.textarea.removeEventListener('scroll', this.handleScroll);
            this.observer.disconnect();
            this.overlay.remove();
            setStyle(this.textarea, this.textareaStyleWas);
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
        key: 'render',
        value: function render() {
            var skipUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!skipUpdate) {
                this.update();
            }
            this.sync();
        }
    }, {
        key: 'createWrapper',
        value: function createWrapper() {
            this.wrapper = document.createElement('div');
            this.wrapper.className = 'textoverlay-wrapper';
            setStyle(this.wrapper, css.wrapper);
            this.wrapper.style.position = this.textareaStyle.position === 'static' ? 'relative' : this.textareaStyle.position;
            var parentElement = this.textarea.parentElement;
            parentElement.insertBefore(this.wrapper, this.textarea);
            this.wrapper.appendChild(this.textarea);
        }
    }, {
        key: 'createOverlay',
        value: function createOverlay() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'textoverlay';
            setStyle(this.overlay, css.overlay);
            this.copyTextareaStyle(this.overlay, properties.overlay);
            this.wrapper.insertBefore(this.overlay, this.textarea);
        }
        /**
         * Update contents of textoverlay
         */

    }, {
        key: 'update',
        value: function update() {
            var _this2 = this;

            // Remove all child nodes from overlay.
            while (this.overlay.firstChild) {
                this.overlay.removeChild(this.overlay.firstChild);
            }
            this.computeOverlayNodes().forEach(function (node) {
                _this2.overlay.appendChild(node);
            });
        }
        /**
         * Sync scroll and size of textarea
         */

    }, {
        key: 'sync',
        value: function sync() {
            this.overlay.style.top = -this.textarea.scrollTop + 'px';
            // In IE11, dimensions returned by `getComputedStyle` do not take
            // `box-sizing` into account. We use `getBoundingClientRect` instead as a
            // workaround.
            var boundingRect = this.wrapper.getBoundingClientRect();
            this.wrapper.style.height = boundingRect.height + 'px';
            if (this.wrapperDisplay !== 'block') {
                this.wrapper.style.width = boundingRect.width + 'px';
            }
        }
    }, {
        key: 'computeOverlayNodes',
        value: function computeOverlayNodes() {
            return this.strategies.reduce(function (ns, strategy) {
                var highlight = document.createElement('span');
                setStyle(highlight, strategy.css);
                return Array.prototype.concat.apply([], ns.map(function (node) {
                    if (node.nodeType !== Node.TEXT_NODE) {
                        return node;
                    }
                    var text = node.textContent || '';
                    var resp = [];
                    while (true) {
                        var prevIndex = strategy.match.lastIndex;
                        var match = strategy.match.exec(text);
                        if (!match) {
                            resp.push(document.createTextNode(text.slice(prevIndex)));
                            break;
                        }
                        var str = match[0];
                        resp.push(document.createTextNode(text.slice(prevIndex, strategy.match.lastIndex - str.length)));
                        var span = highlight.cloneNode();
                        span.textContent = str;
                        resp.push(span);
                    }
                    return resp;
                }));
            }, [document.createTextNode(this.textarea.value)]);
        }
    }, {
        key: 'handleInput',
        value: function handleInput() {
            this.render();
        }
    }, {
        key: 'handleScroll',
        value: function handleScroll() {
            this.render(true);
        }
    }, {
        key: 'handleResize',
        value: function handleResize() {
            this.render(true);
        }
    }, {
        key: 'copyTextareaStyle',
        value: function copyTextareaStyle(target, keys) {
            var _this3 = this;

            keys.forEach(function (key) {
                target.style.setProperty(key, _this3.textareaStyle.getPropertyValue(key));
            });
        }
    }]);

    return Textoverlay;
}();
/**
 * Set style to the element.
 */


exports.default = Textoverlay;
function setStyle(element, style) {
    Object.keys(style).forEach(function (key) {
        element.style.setProperty(key, style[key]);
    });
}

/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=textoverlay.es5.js.map