const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ]
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    modules: ['./src', './node_modules'],
  },
  output: {
    filename: 'snek.js',
    path: path.resolve(__dirname, 'dist'),
  }
};
