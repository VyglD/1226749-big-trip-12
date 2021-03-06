const path = require('path');
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: path.join('js', 'bundle.js'),
    path: path.join(__dirname, 'public'),
  },
  devtool: 'source-map',
  devServer: {
    port: 41425,
    open: true,
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
  },
  module: {
    rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
        }
    ]
  },
  plugins: [
    new MomentLocalesPlugin()
  ]
};
