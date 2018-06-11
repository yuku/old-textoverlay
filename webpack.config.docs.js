/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
    new MiniCssExtractPlugin()
  ],
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
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader?importLoaders=1",
          "postcss-loader",
        ],
      },
    ],
  },
  output: {
    path: path.join(__dirname, "docs"),
    filename: "bundle.js",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          beautify: false,
          mangle: {
            // We do not use Function.prototype.name.
            keep_fnames: false,
          },
          compress: {
            // We do not use Function.length.
            keep_fargs: false,
            // We do not use Function.prototype.name.
            keep_fnames: false,
          },
          comments: false,
        }
      })
    ]
  },
};
