const path = require('path');

module.exports = [ {

  entry: [ './CANVAS' ],

  output: {
    filename: 'CanvasBundle.js',
    path: path.resolve(__dirname, 'public/js/bundles/')
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0', 'react', 'env'],
          plugins:  [ ['transform-runtime', {
            'polyfill': false,
            'regenerators': true
          } ], 'transform-async-to-generator']
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  devtool: 'cheap-inline-module-sourse-map'
}, {

  entry: [ './WEBGL' ],

  output: {
    filename: 'WebGLBundle.js',
    path: path.resolve(__dirname, 'public/js/bundles/')
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0', 'react', 'env'],
          plugins:  [ ['transform-runtime', {
            'polyfill': false,
            'regenerators': true
          } ], 'transform-async-to-generator']
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  devtool: 'cheap-inline-module-sourse-map'
} ];
