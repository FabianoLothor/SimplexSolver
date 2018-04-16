var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    contentBase: './dist',
    host: '0.0.0.0',
    hot: true,
    open: true,
    historyApiFallback: true,
    inline: true
  },
};

module.exports = config;