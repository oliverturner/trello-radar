var webpack           = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var precss            = require('precss')
var autoprefixer      = require('autoprefixer')

var cssLoaders = 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss'

module.exports = {
  entry:   './app/index.jsx',
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
        test:   /\.s?css$/,
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
      template: './_config/tmpl.html'
    })
  ],

  postcss: function () {
    return [precss, autoprefixer]
  }
}

