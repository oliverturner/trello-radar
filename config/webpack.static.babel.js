import Webpack           from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

var cssLoaders = 'style!css?modules&localIdentName=[hash:base64]!postcss'

module.exports = {
  // entry: [
  //   './src/static.jsx'
  // ],

  debug: false,

  output: {
    path:       './dist',
    publicPath: '',
    filename:   'wtf.html'
  },

  module: {
    preLoaders: [],

    loaders: [
      {
        test:    /\.jsx?$/,
        exclude: /node_modules/,
        loader:  'babel'
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
    modulesDirectories: ['src', 'node_modules'],
    extensions:         ['', '.js', '.jsx']
  }
}
