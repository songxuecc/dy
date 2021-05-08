const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 将manifest内联到我们的 index.html
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const webpackDev = {
  devtool: 'source-map',
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      favicon: 'src/assets/images/favicon.ico',
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: /runtime\..*\.js$/
    }),
    //     new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    overlay: {
      errors: true
    },
    // 通知文件更改
    watchOptions: {
      poll: true
    },
    open: false,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://dy.nix.huhuguanjia.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
    host: '0.0.0.0',
    port: 8000
  },
  optimization: {
    moduleIds: 'hashed'
  }
}

module.exports = webpackDev
