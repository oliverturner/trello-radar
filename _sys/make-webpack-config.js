var fs                = require('fs');
var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function extractForProduction (loaders) {
  return ExtractTextPlugin.extract('style', loaders.substr(loaders.indexOf('!')));
}

module.exports = function (options) {
  options.lint = fs.existsSync(__dirname + '/../.eslintrc') && options.lint !== false;

  var localIdentName = options.production ? '[hash:base64]' : '[path]-[local]-[hash:base64:5]';
  var cssLoaders     = 'style!css?localIdentName=' + localIdentName + '!autoprefixer?browsers=last 2 versions';
  var scssLoaders    = cssLoaders + '!sass';

  if (options.production) {
    cssLoaders  = extractForProduction(cssLoaders);
    scssLoaders = extractForProduction(scssLoaders);
  }

  var jsLoaders = ['babel'];

  return {
    entry:   './app/index.jsx',
    debug:   !options.production,
    devtool: options.devtool,
    output:  {
      path:       options.production ? './dist' : './build',
      publicPath: options.production ? '' : 'http://0.0.0.0:4000/',
      filename:   options.production ? 'app.[hash].js' : 'app.js'
    },

    module: {
      preLoaders: options.lint ? [
        {
          test:    /\.jsx?$/,
          exclude: /node_modules/,
          loader:  'eslint'
        }
      ] : [],

      loaders: [
        {
          test:    /\.js$/,
          exclude: /node_modules/,
          loaders: jsLoaders
        },
        {
          test:    /\.jsx$/,
          exclude: /node_modules/,
          loaders: options.production ? jsLoaders : ['react-hot'].concat(jsLoaders)
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
      extensions: ['', '.js', '.jsx', '.sass', '.scss', '.less', '.css']
    },

    plugins: options.production ? [
      // Important to keep React file size down
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new ExtractTextPlugin('app.[hash].css'),
      new HtmlWebpackPlugin({
        template:   './_sys/tmpl.html',
        production: true
      })
    ] : [
      new HtmlWebpackPlugin({
        template: './_sys/tmpl.html'
      })
    ]
  };
};
