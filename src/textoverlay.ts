/**
 * textoverlay.js - Simple decorator for textarea elements
 *
 * @author Yuku Takahashi <taka84u9@gmail.com>
 */

const css = {
  backdrop: {
    'box-sizing': 'border-box',
    'position': 'absolute',
    'margin': '0px',
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
    'margin': '0px',
  },
  textarea: {
    background: 'transparent',
  },
};

// Firefox does not provide shorthand properties in getComputedStyle, so we use
// the expanded ones here.
const properties = {
  background: [
    'background-attachment',
    'background-blend-mode',
    'background-clip',
    'background-color',
    'background-image',
    'background-origin',
    'background-position',
    'background-position-x',
    'background-position-y',
    'background-repeat',
    'background-size',
  ],
  overlay: [
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
  ],
};

export interface Strategy {
  match: Matcher;
  css: CssStyle;
}

// A matcher can be a RegExp or a RegExp-like object.
export interface Matcher {
  lastIndex: number;
  exec: (input: string) => null | [string] | RegExpExecArray;
}

// Can't use `keyof CSSStyleDeclaration` because it only has camelCase keys.
export interface CssStyle {
  [cssProperty: string]: string;
}

export default class Textoverlay {
  public strategies: Strategy[];
  public readonly backdrop: HTMLDivElement;
  public readonly overlay: HTMLDivElement;
  public readonly textarea: HTMLTextAreaElement;
  private overlayPositioner: HTMLDivElement|null = null;
  private textareaStyle: CSSStyleDeclaration;
  private textareaStyleWas: CssStyle;
  private observer: MutationObserver;
  private resizeListener: () => void;

  constructor(textarea: HTMLTextAreaElement, strategies: Strategy[]) {
    if (textarea.parentElement === null) {
      throw new Error('textarea must be in the DOM tree');
    }
    this.textarea = textarea;
    this.textareaStyle = window.getComputedStyle(textarea);

    this.backdrop = document.createElement('div');
    this.backdrop.className = 'textoverlay-backdrop';
    setStyle(this.backdrop, css.backdrop);
    this.copyTextareaStyle(this.backdrop, properties.background);
    this.textarea.parentElement!.insertBefore(this.backdrop, this.textarea);

    this.overlay = document.createElement('div');
    this.overlay.className = 'textoverlay';
    setStyle(this.overlay, css.overlay);
    this.copyTextareaStyle(this.overlay, properties.overlay);
    this.textarea.parentElement!.insertBefore(this.overlay, this.textarea);

    this.syncStyles();

    this.textareaStyleWas = {};
    Object.keys(css.textarea).forEach((key) => {
      this.textareaStyleWas[key] = this.textarea.style.getPropertyValue(key);
    });
    setStyle(this.textarea, css.textarea);

    this.strategies = strategies;
    this.textarea.addEventListener('input', () => {
      this.handleInput();
    });
    this.textarea.addEventListener('scroll', () => {
      this.handleScroll();
    });
    this.observer = new MutationObserver(() => {
      this.syncStyles();
    });
    this.observer.observe(this.textarea, {
      attributes: true,
      attributeFilter: ['style'],
    });
    // Listen to resize to detect changes in the element offset position.
    this.resizeListener = () => {
      this.syncStyles();
    };
    window.addEventListener('resize', this.resizeListener);
    this.render();
  }

  public destroy() {
    window.removeEventListener('resize', this.resizeListener);
    this.textarea.removeEventListener('input', this.handleInput);
    this.textarea.removeEventListener('scroll', this.handleScroll);
    this.observer.disconnect();
    this.overlay.remove();
    this.backdrop.remove();
    setStyle(this.textarea, this.textareaStyleWas);
  }

  /**
   * Public API to update and sync textoverlay
   */
  public render(skipUpdate: boolean = false) {
    if (!skipUpdate) {
      this.updateOverlayNodes();
    }
    this.syncStyles();
  }

  private updateOverlayNodes() {
    // Remove all child nodes from overlay.
    this.overlay.innerHTML = '';
    this.overlayPositioner = document.createElement('div');
    this.overlayPositioner.className = 'textoverlay-positioner';
    this.overlayPositioner.style.display = 'block';
    this.overlay.appendChild(this.overlayPositioner);
    this.computeOverlayNodes().forEach((node) => {
      this.overlay.appendChild(node);
    });
  }

  private syncStyles() {
    // All the reads must happen before all the writes to prevent layout
    // thrashing, because every write means all subsequenet reads' caches are
    // invalidated.
    const top = this.textarea.offsetTop;
    const left = this.textarea.offsetLeft;
    const height = this.textarea.offsetHeight;
    // We must use `clientWidth` as we need to exclude the potential vertical
    // scrollbar. `clientWidth` includes paddings but not borders.
    const width = this.textarea.clientWidth +
        parseInt(this.textareaStyle.borderLeftWidth || '0', 10) +
        parseInt(this.textareaStyle.borderRightWidth || '0', 10);
    const textareaScrollTop = this.textarea.scrollTop;
    const textareaZIndex = this.textareaStyle.zIndex !== null &&
            this.textareaStyle.zIndex !== 'auto' ?
        +this.textareaStyle.zIndex :
        0;

    // Writes:
    this.backdrop.style.zIndex = `${textareaZIndex - 2}`;
    this.overlay.style.zIndex = `${textareaZIndex - 1}`;
    this.backdrop.style.left = this.overlay.style.left = `${left}px`;
    this.backdrop.style.top = this.overlay.style.top = `${top}px`;
    this.backdrop.style.height = this.overlay.style.height = `${height}px`;
    this.backdrop.style.width = this.overlay.style.width = `${width}px`;
    this.setOverlayScroll(textareaScrollTop);
  }

  private setOverlayScroll(textareaScrollTop: number) {
    if (this.overlayPositioner !== null) {
      this.overlayPositioner.style.marginTop = `-${textareaScrollTop}px`;
    }
  }

  private computeOverlayNodes(): Node[] {
    return this.strategies.reduce((ns: Node[], strategy) => {
      const highlight = document.createElement('span');
      setStyle(highlight, strategy.css);
      const result: Node[] = [];
      ns.forEach((node) => {
        if (node.nodeType !== Node.TEXT_NODE) {
          result.push(node);
          return;
        }
        const text = node.textContent || '';
        while (true) {
          const prevIndex = strategy.match.lastIndex;
          const match = strategy.match.exec(text);
          if (!match) {
            if (prevIndex === 0) {
              if (text) {
                result.push(node);
              }
            } else if (prevIndex < text.length) {
              result.push(document.createTextNode(text.slice(prevIndex)));
            }
            break;
          }
          const str = match[0];
          const textBetweenMatches =
              text.slice(prevIndex, strategy.match.lastIndex - str.length);
          if (textBetweenMatches) {
            result.push(document.createTextNode(textBetweenMatches));
          }
          if (str) {
            const span = highlight.cloneNode(false);
            span.textContent = str;
            result.push(span);
          }
        }
      });
      return result;
    }, [document.createTextNode(this.textarea.value)]);
  }

  private handleInput() {
    this.render();
  }

  private handleScroll() {
    this.setOverlayScroll(this.textarea.scrollTop);
  }

  private copyTextareaStyle(target: HTMLElement, keys: string[]) {
    keys.forEach((key) => {
      target.style.setProperty(key, this.textareaStyle.getPropertyValue(key));
    });
  }
}

/**
 * Set style to the element.
 */
function setStyle(element: HTMLElement, style: CssStyle) {
  Object.keys(style).forEach((key) => {
    element.style.setProperty(key, style[key]);
  });
}
