var Webpack           = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var cssLoaders  = 'style!css?localIdentName=[hash:base64]!autoprefixer?browsers=last 2 versions'
var scssLoaders = cssLoaders + '!sass'

function extractForProduction (loaders) {
  return ExtractTextPlugin.extract('style', loaders.substr(loaders.indexOf('!')))
}

module.exports = {
  entry: './app/index.jsx',
  debug: false,

  output: {
    path:       './dist',
    publicPath: '',
    filename:   'app.[hash].js'
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
        loader: extractForProduction(cssLoaders)
      },
      {
        test:   /\.scss$/,
        loader: extractForProduction(scssLoaders)
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
    // Important to keep React file size down
    new Webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new Webpack.optimize.DedupePlugin(),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('app.[hash].css'),
    new HtmlWebpackPlugin({
      template:   './_config/tmpl.html',
      production: true
    })
  ]
}
