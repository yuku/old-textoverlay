import './main.css';

import Textoverlay from '../textoverlay';

import hljs from '../../node_modules/highlight.js/lib/highlight';
import hljsBash from '../../node_modules/highlight.js/lib/languages/bash';
import hljsJavascript from '../../node_modules/highlight.js/lib/languages/javascript';

hljs.registerLanguage('bash', hljsBash);
hljs.registerLanguage('javascript', hljsJavascript);
hljs.initHighlightingOnLoad();

function main() {
    const textarea = document.getElementById('textarea') as HTMLTextAreaElement;
    // tslint:disable-next-line:no-unused-expression
    new Textoverlay(textarea, [
        {
            match: /\B@\w+/g,
            css: { 'background-color': '#d8dfea' },
        },
        {
            match: /e\w{8}d/g,
            css: { 'background-color': '#cc9393' },
        },
    ]);
}

document.addEventListener('DOMContentLoaded', main);
