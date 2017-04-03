/**
 * textoverlay.js - Simple decorator for textarea elements
 *
 * @author Yuku Takahashi <taka84u9@gmil.com>
 * @flow
 */

import flatten from "./utils/flatten";
import setStyle from "./utils/setStyle";
import getStyle from "./utils/getStyle";

const css = {
  wrapper: {
    "box-sizing": "border-box",
    overflow: "hidden",
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
    width: "100%",
  },
  textarea: {
    background: "transparent",
    "box-sizing": "border-box",
    outline: "none",
    position: "relative",
    height: "100%",
    width: "100%",
    margin: "0px",
  },
};

const properties = {
  wrapper: [
    "background",
    "display",
    "margin",
  ],
  overlay: [
    "font-family",
    "font-size",
    "font-weight",
    "line-height",
    "padding",
    "border-width",
  ],
};

export type Strategy = {
  match: RegExp;
  css: { [string]: string };
};

export default class Textoverlay {
  origStyle: { [string]: string };
  strategies: Strategy[];
  observer: MutationObserver;
  wrapperDisplay: string;

  overlay: HTMLDivElement;
  textarea: HTMLTextAreaElement;
  wrapper: HTMLDivElement;

  handleInput: () => void;
  handleResize: () => void;
  handleScroll: () => void;

  static createWrapper(textarea: HTMLTextAreaElement, parentElement: Element) {
    const position = getStyle(textarea, ["position"]).position;
    const wrapper = document.createElement("div");
    wrapper.className = "textoverlay-wrapper";
    setStyle(wrapper, Object.assign({}, getStyle(textarea, properties.wrapper), css.wrapper, {
      position: position === "static" ? "relative" : position,
    }));
    parentElement.insertBefore(wrapper, textarea);
    parentElement.removeChild(textarea);
    wrapper.appendChild(textarea);
    return wrapper;
  }

  static createOverlay(textarea: HTMLTextAreaElement, wrapper: HTMLDivElement) {
    const overlay = document.createElement("div");
    overlay.className = "textoverlay";

    setStyle(overlay, Object.assign({}, css.overlay, getStyle(textarea, properties.overlay)));
    wrapper.insertBefore(overlay, textarea);
    return overlay;
  }

  constructor(textarea: HTMLTextAreaElement, strategies: Strategy[]) {
    const parentElement = textarea.parentElement;
    if (!parentElement) {
      throw new Error("textarea must in DOM tree");
    }

    this.origStyle = getStyle(textarea, Object.keys(css.textarea));

    this.wrapper = Textoverlay.createWrapper(textarea, parentElement);
    this.overlay = Textoverlay.createOverlay(textarea, this.wrapper);

    setStyle(textarea, css.textarea);
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
      attributeFilter: ["style"],
    });

    this.wrapperDisplay = getStyle(this.wrapper, ["display"])["display"];
    this.render();
  }

  destroy() {
    this.textarea.removeEventListener("input", this.handleInput);
    this.textarea.removeEventListener("scroll", this.handleScroll);
    this.observer.disconnect();

    setStyle(this.textarea, this.origStyle);

    this.overlay.remove();
    this.textarea.remove();
    const parentElement = this.wrapper.parentElement;
    if (parentElement) {
      parentElement.insertBefore(this.textarea, this.wrapper);
      this.wrapper.remove();
    }
  }

  /**
   * Public API to update and sync textoverlay
   */
  render(skipUpdate: boolean = false) {
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
  update() {
    // Remove all child nodes from overlay.
    while (this.overlay.firstChild) {
      this.overlay.removeChild(this.overlay.firstChild);
    }

    this.computeOverlayNodes().forEach(node => this.overlay.appendChild(node));
  }

  /**
   * Sync scroll and size of textarea
   *
   * @private
   */
  sync() {
    setStyle(this.overlay, { top: `${-this.textarea.scrollTop}px` });
    const props = this.wrapperDisplay === "block" ? ["height"] : ["height", "width"];
    setStyle(this.wrapper, getStyle(this.textarea, props));
  }

  /**
   * @private
   */
  computeOverlayNodes(): Node[] {
    return this.strategies.reduce((ns: Node[], strategy) => {
      const highlight = document.createElement("span");
      setStyle(highlight, strategy.css);
      return flatten(ns.map(node => {
        if (!(node instanceof Text)) { return node; }
        const text = node.textContent;
        const resp = [];
        for (let prevIndex = strategy.match.lastIndex = 0;; prevIndex = strategy.match.lastIndex) {
          const match = strategy.match.exec(text);
          if (!match) {
            resp.push(new Text(text.substr(prevIndex)));
            break;
          }
          const str = match[0];
          resp.push(new Text(text.substr(prevIndex, strategy.match.lastIndex - prevIndex - str.length)));
          const span = highlight.cloneNode();
          span.textContent = str;
          resp.push(span);
        }
        return resp;
      }));
    }, [new Text(this.textarea.value)]);
  }

  handleInput() {
    this.render(); 
  }

  handleScroll() {
    this.render(true); 
  }

  handleResize() {
    this.render(true); 
  }
}
