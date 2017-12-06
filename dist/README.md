# textoverlay distribution files

* `bundle.js` - unminified Babel-processed bundle, UMD and global variable export via webpack.
* `bundle.min.js` - same as above, but minified with webpack + UglifyJS.
* `textoverlay.js` - ES Next version of textoverlay (native modules).

Babel-processed bundles use `babel-preset-env` with the following [browserslist]: `"last 2 versions", "IE >= 9"`.

[browserslist]: https://github.com/ai/browserslist
