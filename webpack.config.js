const path = require('path');
// @ts-ignore
const nodeExternals = require('webpack-node-externals');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

var mode =  process.env.NODE_ENV === 'production' ? 'production' : 'development';
var watch = process.env.NODE_ENV === 'development';

var clientConfig = Object.assign({}, {
  entry: path.join(__dirname, '/src/public/index.ts'),
  mode: mode,
  watch: true,
  output: {
    path: path.join(__dirname, '/src/public'),
    filename: 'index.js',
    publicPath: ''
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js', '.mts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [{
          loader: 'ts-loader',
          options: {
              configFile: "tsconfig.client.json"
          }
      }],
      exclude: /node_modules/,
      },
    ]
  }
});

var serverConfig = Object.assign({}, {
  entry: path.join(__dirname, '/src/server.ts'),
  mode: mode,
  watch: watch,
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'server.js'
  },
  target: 'node',
  externals: nodeExternals(),
  resolve: {
    extensions: ['.ts', '.js', '.mts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [{
          loader: 'ts-loader',
          options: {
              configFile: "tsconfig.json"
          }
      }],
        exclude: /node_modules/
      },
    ]
  }

});

module.exports = [clientConfig]

// module.exports = {
//   entry: path.join(__dirname, '/src/public/clientProducts.ts'),
//   mode: 'production',
//   output: {
//     path: path.join(__dirname, '/dist/public'),
//     publicPath: ''
//   },
//   target: 'web',
//   resolve: {
//     extensions: ['.ts', '.js', '.mts', '.tsx']
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       hash: false,
//       inject: false,
//       template: './src/public/index.hbs',
//     })
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/i,
//         use: 'ts-loader',
//         exclude: /node_modules/
//       },
//       {
//         test: /\.hbs$/,
//         loader: "handlebars-loader"
//       }
//     ]
//   }
// }