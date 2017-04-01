# textoverlay

Simple decorator for textarea elements.

## Demo

[![](http://yuku-t.com/textoverlay/media/demo.png)](http://yuku-t.com/textoverlay/#textarea)

```javascript
new Textoverlay(document.getElementById("textarea"), [
  {
    match: /\B@\w+/g,
    css: { "background-color": "#d8dfea" }
  },
  {
    match: /e\w{8}d/g,
    css: { "background-color": "#cc9393" }
  }
]);
```

[Live demo](http://yuku-t.com/textoverlay)

## Installation

```bash
npm install textoverlay
```

## License

Textoverlay is released under the [MIT](https://github.com/yuku-t/textoverlay/blob/master/LICENSE) License.
