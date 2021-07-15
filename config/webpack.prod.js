const { merge } = require("webpack-merge");
const common = require("./webpack.config");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = merge(common, {
  mode: "production",
});
