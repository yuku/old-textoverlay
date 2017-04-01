/* eslint-env node */

const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCSS = new ExtractTextPlugin("[name].css");

module.exports = {
  devtool: "source-map",
  devServer: {
    contentBase: "docs",
  },
  entry: {
    bundle: "./src/docs/main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: "style-loader",
          use: [
            "css-loader?importLoaders=1",
            "postcss-loader",
          ],
        }),
      },
    ],
  },
  output: {
    path: path.join(__dirname, "docs"),
    filename: "bundle.js",
  },
  plugins: [
    extractCSS,
  ],
};
