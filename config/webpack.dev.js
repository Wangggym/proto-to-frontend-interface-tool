const common = require("./webpack.config");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  watch: true,
  mode: "development",
  devtool: "source-map",
});
