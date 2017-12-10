/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCSS = new ExtractTextPlugin("[name].css");

module.exports = {
  devtool: "source-map",
  devServer: {
    contentBase: "docs",
  },
  entry: {
    bundle: "./src/docs/main.ts",
  },
  resolve: {
    extensions: [".ts", ".js", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }],
        exclude: /node_modules/
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
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        // We do not use Function.prototype.name.
        keep_fnames: false,
        // We do not support IE8.
        screw_ie8: true,
      },
      compress: {
        // We do not use Function.length.
        keep_fargs: false,
        // We do not use Function.prototype.name.
        keep_fnames: false,
        // We do not support IE8.
        screw_ie8: true,
      },
      comments: false,
      sourceMap: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ],
};
