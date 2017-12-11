export interface Strategy {
    match: Matcher;
    css: CssStyle;
}
export interface Matcher {
    lastIndex: number;
    exec: (input: string) => null | [string] | RegExpExecArray;
}
export interface CssStyle {
    [cssProperty: string]: string;
}
export default class Textoverlay {
    strategies: Strategy[];
    observer: MutationObserver;
    wrapperDisplay: string;
    overlay: HTMLDivElement;
    textarea: HTMLTextAreaElement;
    textareaStyle: CSSStyleDeclaration;
    textareaStyleWas: CssStyle;
    wrapper: HTMLDivElement;
    constructor(textarea: HTMLTextAreaElement, strategies: Strategy[]);
    destroy(): void;
    /**
     * Public API to update and sync textoverlay
     */
    render(skipUpdate?: boolean): void;
    protected createWrapper(): void;
    protected createOverlay(): void;
    /**
     * Update contents of textoverlay
     */
    private update();
    /**
     * Sync scroll and size of textarea
     */
    private sync();
    private computeOverlayNodes();
    private handleInput();
    private handleScroll();
    private handleResize();
    private copyTextareaStyle(target, keys);
}
