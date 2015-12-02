var webpack           = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var cssLoaders  = 'style!css?localIdentName=[path]-[local]-[hash:base64:5]!autoprefixer?browsers=last 2 versions'
var scssLoaders = cssLoaders + '!sass'

module.exports = {
  entry:   './app/index.jsx',
  debug:   true,
  devtool: 'eval',
  output:  {
    path:       './build',
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
        test:   /\.css$/,
        loader: cssLoaders
      },
      {
        test:   /\.scss$/,
        loader: scssLoaders
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
      template: './_sys/tmpl.html'
    })
  ]
};

