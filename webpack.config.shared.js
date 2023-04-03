const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => ({
  entry: path.resolve(__dirname, 'src', "lib.ts"),
  output: {
    path: path.resolve(__dirname, 'build', env.dev ? "dev" : "prod"),
    filename: 'lib.js',
    library: 'Dex',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          // lib.ts => lib.js
          { loader: 'babel-loader' }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, `package.build.${env.dev ? "dev" : "prod"}.json`),
          to: path.resolve(__dirname, 'build', env.dev ? "dev" : "prod", 'package.json')
        }
      ]
    })
  ]
});