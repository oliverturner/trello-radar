var webpack           = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var cssnext           = require('postcss-cssnext')
var nested            = require('postcss-nested')

var cssLoaders = 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss'

var m = require('../src/utils/metrics').default

m.init()

module.exports = {
  entry:   './src/index.jsx',
  debug:   true,
  devtool: 'eval',

  output: {
    path:       './public',
    publicPath: '/',
    filename:   'app.js'
  },

  module: {
    preLoaders: [],

    loaders: [
      {
        test:    /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
        test:   /\.p?css$/,
        loader: cssLoaders
      },
      {
        test:   /\.png$/,
        loader: 'url?limit=100000&mimetype=image/png'
      },
      {
        test:   /\.svg$/,
        loader: 'url?limit=100000&mimetype=image/svg+xml'
      },
      {
        test:   /\.gif$/,
        loader: 'url?limit=100000&mimetype=image/gif'
      },
      {
        test:   /\.jpg$/,
        loader: 'file'
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './config/tmpl.html'
    })
  ],

  postcss: function () {
    return [cssnext, nested]
  },

  devServer: {
    noInfo:      true,
    port:        4000,
    contentBase: './public'
  }
}

