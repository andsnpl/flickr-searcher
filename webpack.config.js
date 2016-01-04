var webpack = require('webpack'),
    path = require('path'),
    autoprefixer = require('autoprefixer'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = exports = {
  entry: {
    index: [path.resolve(__dirname, 'src/js/index.js')]
  },
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: 'js/[name].min.js',
    chunkFilename: 'js/[id].min.js'
  },
  module: {
    preLoaders: [
      { test: /\.s[ac]ss$/,
        loaders: ['sass'] }
    ],
    loaders: [
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          env: {
            development: {
              presets: []
            }
          }
        } },
      { test: /\.s[ac]ss$/,
        loaders: ['style', 'css', 'postcss'] }
    ]
  },
  postcss: function () {
    return [autoprefixer];
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: true
    })
  ]
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.keys(exports.entry).forEach(function (name) {
      exports.entry[name].unshift(
        'eventsource-polyfill',
        'webpack-hot-middleware/client');
    });

    exports.plugins.unshift(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin());

    break;

  default:
    // nothing
}
