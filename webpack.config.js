const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  entry: './network/static/network/assets/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './network/static/network'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
    ]
  },
  optimization: {
    minimizer: [
        new TerserPlugin({
            terserOptions: {
                keep_fnames: true, // Preserve function names
            },
        }),
    ],
},
devtool: 'source-map',
};
