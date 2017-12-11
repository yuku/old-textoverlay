/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");

// We only use Webpack to compile an ES5 version of textoverlay that
// exports itself to the `Textoverlay` global.
const defaultConfig = {
  devtool: "source-map",
  context: path.join(__dirname, "src"),
  entry: {
    textoverlay: "./textoverlay.ts",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "textoverlay.es5.js",
    libraryTarget: "umd",
    // `library` determines the name of the global variable
    library: "Textoverlay",
    libraryExport: "default"
  },
  resolve: {
    extensions: [".ts"]
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
              transpileOnly: true,
              compilerOptions: {
                // Declarations are already produced when building the non-ES5 version.
                "declaration": false,
              }
            }
          }],
        exclude: /node_modules/
      },
    ],
  }
};

module.exports = function(env) {
  switch (env) {
    case "min":
      return webpackMerge(defaultConfig, {
        output: {
          filename: "textoverlay.es5.min.js",
        },
        plugins: [
          new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
          }),
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
      });
    default:
      return defaultConfig;
  }

  throw `Unknown env ${env}`;
};
