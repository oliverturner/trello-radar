import HtmlWebpackPlugin from 'html-webpack-plugin'
import cssnext           from 'postcss-cssnext'
import nested            from 'postcss-nested'

// import m from '../src/utils/metrics'

var cssLoaders = 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss'

module.exports = {
  entry: [
    'sanitize.css/lib/sanitize.css',
    './src/index.jsx'
  ],

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
        test:   require.resolve('react-addons-perf'),
        loader: 'expose?Perf'
      },
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
    modulesDirectories: ['src', 'node_modules'],
    extensions:         ['', '.js', '.jsx']
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
