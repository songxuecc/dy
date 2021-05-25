const path = require('path')
const os = require('os')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpackPro = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[id].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js',
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[id].[contenthash].css',
      ignoreOrder: true // 忽略有关顺序冲突的警告
    }),
    new HtmlWebpackPlugin({
      favicon: 'src/assets/images/favicon.ico',
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'baidu_verify_2pyTRyh7tH.html',
      template: 'baidu_verify_2pyTRyh7tH.html',
      inject: false
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    new ScriptExtHtmlWebpackPlugin({
      inline: /runtime\..*\.js$/
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.less$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeUnicode: false, // 建议false,否则在使用unicode-range的时候会产生乱码
          safe: true // 避免 cssnano 重新计算 z-index
        }]
      },
      canPrint: true
    })
  ],
  optimization: {
    moduleIds: 'size',
    minimizer: [
      new UglifyJsPlugin({
        exclude: /\.min\.js$/,
        parallel: os.cpus().length,
        cache: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true
          },
          output: {
            beautify: false,
            comments: false
          }
        }
      }),
      // 这样配置会存在只有css压缩的问题，这时webpack4原本自己配置好的js压缩会无效 ，需要重新配置UglifyJsPlugin（用于压缩js,webpack4内置了）一下
      // https://www.jianshu.com/p/dd9afa5c4d0f
      new OptimizeCssAssetsPlugin({})
    ]
  },
  performance: {
    maxEntrypointSize: 5000000,
    maxAssetSize: 3000000
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
}

module.exports = webpackPro
