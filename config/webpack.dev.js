const common = require('./webpack.config');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 9000,
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/assets/index.dev.html' })],
});
