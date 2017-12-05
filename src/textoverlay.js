/**
 * textoverlay.js - Simple decorator for textarea elements
 *
 * @author Yuku Takahashi <taka84u9@gmil.com>
 * @flow
 */

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

// Firefox does not provide shorthand properties in getComputedStyle, so we use the expanded ones here.
const properties = {
  wrapper: [
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-position-x",
    "background-position-y",
    "background-repeat",
    "background-size",
    "display",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
  ],
  overlay: [
    "font-family",
    "font-size",
    "font-weight",
    "line-height",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
  ],
};

export type Strategy = {
  match: RegExp;
  css: { [string]: string };
};

export default class Textoverlay {
  strategies: Strategy[];
  observer: MutationObserver;
  wrapperDisplay: string;

  overlay: HTMLDivElement;
  textarea: HTMLTextAreaElement;
  textareaStyle: CSSStyleDeclaration;
  textareaStyleWas: { [string]: string };
  wrapper: HTMLDivElement;

  handleInput: () => void;
  handleResize: () => void;
  handleScroll: () => void;

  constructor(textarea: HTMLTextAreaElement, strategies: Strategy[]) {
    if (!textarea.parentElement) {
      throw new Error("textarea must be in the DOM tree");
    }
    this.textarea = textarea;
    this.textareaStyle = window.getComputedStyle(textarea);
    this.createWrapper();
    this.createOverlay();

    this.textareaStyleWas = {};
    Object.keys(css.textarea).forEach(key => {
      this.textareaStyleWas[key] = this.textarea.style.getPropertyValue(key);
    });
    setStyle(this.textarea, css.textarea);

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

    this.wrapperDisplay = this.wrapper.style.display;
    this.render();
  }

  /**
   * @protected
   */
  createWrapper() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "textoverlay-wrapper";
    setStyle(this.wrapper, css.wrapper);
    this.wrapper.style.position =
        this.textareaStyle.position === "static" ? "relative" : this.textareaStyle.position;
    const parentElement: Element = (this.textarea.parentElement: any);
    parentElement.insertBefore(this.wrapper, this.textarea);
    this.wrapper.appendChild(this.textarea);
  }

  /**
   * @protected
   */
  createOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.className = "textoverlay";
    setStyle(this.overlay, css.overlay);
    this.copyTextareaStyle(this.overlay, properties.overlay);
    this.wrapper.insertBefore(this.overlay, this.textarea);
  }

  destroy() {
    this.textarea.removeEventListener("input", this.handleInput);
    this.textarea.removeEventListener("scroll", this.handleScroll);
    this.observer.disconnect();
    this.overlay.remove();
    setStyle(this.textarea, this.textareaStyleWas);
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
    this.overlay.style.top = `${-this.textarea.scrollTop}px`;
    // In IE11, dimensions returned by `getComputedStyle` do not take `box-sizing` into account.
    // We use `getBoundingClientRect` instead as a workaround.
    const boundingRect = this.wrapper.getBoundingClientRect();
    this.wrapper.style.height = `${boundingRect.height}px`;
    if (this.wrapperDisplay !== "block") {
        this.wrapper.style.width = `${boundingRect.width}px`;
    }
  }

  /**
   * @private
   */
  computeOverlayNodes(): Node[] {
    return this.strategies.reduce((ns: Node[], strategy) => {
      const highlight = document.createElement("span");
      setStyle(highlight, strategy.css);
      return Array.prototype.concat.apply([], ns.map(node => {
        if (node.nodeType != Node.TEXT_NODE) { return node; }
        const text = node.textContent;
        const resp = [];
        while (true) {
          const prevIndex = strategy.match.lastIndex;
          const match = strategy.match.exec(text);
          if (!match) {
            resp.push(document.createTextNode(text.slice(prevIndex)));
            break;
          }
          const str = match[0];
          resp.push(document.createTextNode(text.slice(prevIndex, strategy.match.lastIndex - str.length)));
          const span = highlight.cloneNode();
          span.textContent = str;
          resp.push(span);
        }
        return resp;
      }));
    }, [document.createTextNode(this.textarea.value)]);
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

  /**
   * @private
   */
  copyTextareaStyle(target: HTMLElement, keys: string[]) {
    keys.forEach(key => {
      target.style.setProperty(key, this.textareaStyle.getPropertyValue(key));
    });
  }
}

/**
 * Set style to the element.
 */
function setStyle(element: HTMLElement, style: { [string]: string }) {
  Object.keys(style).forEach(key => {
    element.style.setProperty(key, style[key]);
  });
}
