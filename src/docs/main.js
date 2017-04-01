require("./main.css");

import Textoverlay from "../textoverlay";
import hljs from "../../node_modules/highlight.js/lib/highlight";

hljs.registerLanguage("bash", require("../../node_modules/highlight.js/lib/languages/bash"));
hljs.registerLanguage("javascript", require("../../node_modules/highlight.js/lib/languages/javascript"));
hljs.initHighlightingOnLoad();

function main() {
  const textarea = document.getElementById("textarea");
  if (textarea instanceof HTMLTextAreaElement) {
    new Textoverlay(textarea, [
      {
        match: /\B@\w+/g,
        css: { "background-color": "#d8dfea" },
      },
      {
        match: /e\w{8}d/g,
        css: { "background-color": "#cc9393" },
      },
    ]);
  }
}

window.addEventListener("load", main);
