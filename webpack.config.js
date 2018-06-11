/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

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

module.exports = function(env, argv) {
  switch (argv.mode) {
    case "production":
      return webpackMerge(defaultConfig, {
        output: {
          filename: "textoverlay.es5.min.js",
        },
        plugins: [
          new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
          }),
        ],
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
      });
    default:
      return defaultConfig;
  }
};
