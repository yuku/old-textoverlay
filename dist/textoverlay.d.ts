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
    readonly backdrop: HTMLDivElement;
    readonly overlay: HTMLDivElement;
    readonly textarea: HTMLTextAreaElement;
    private overlayPositioner;
    private textareaStyle;
    private textareaStyleWas;
    private observer;
    private resizeListener;
    constructor(textarea: HTMLTextAreaElement, strategies: Strategy[]);
    destroy(): void;
    /**
     * Public API to update and sync textoverlay
     */
    render(skipUpdate?: boolean): void;
    private updateOverlayNodes();
    private syncStyles();
    private setOverlayScroll(textareaScrollTop);
    private computeOverlayNodes();
    private handleInput();
    private handleScroll();
    private copyTextareaStyle(target, keys);
}
