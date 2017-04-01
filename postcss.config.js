module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-custom-properties"),
    require("postcss-custom-media"),
    require("postcss-apply"),
    require("postcss-nesting"),
    require("postcss-flexbugs-fixes"),
    require("autoprefixer")({
      browsers: [
        "ie >= 11",
        "last 2 Edge versions",
        "last 2 Firefox versions",
        "last 2 Chrome versions",
        "last 2 Safari versions",
        "last 2 Opera versions",
        "last 2 iOS versions",
        "last 2 ChromeAndroid versions",
      ],
    }),
  ],
};
