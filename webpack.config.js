const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './client/index.jsx',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader:  ['babel-loader', 'eslint-loader'], exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|jpg)$/, loader: 'url-loader' },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader?modules=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  plugins: [HtmlWebpackPluginConfig],
};
