const path = require('path')
const os = require('os')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const WebpackObfuscator = require('webpack-obfuscator')
const CompressionPlugin = require('compression-webpack-plugin')

const webpackPro = {
  mode: 'production',
  // devtool: 'hidden-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[id].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js',
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[id].[contenthash].css',
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
    }),
    new CompressionPlugin({
      algorithm: 'gzip', // 'brotliCompress'
      test: /\.js$|\.html$|\.css/, // + $|\.svg$|\.png$|\.jpg
      threshold: 10240, // 对超过10k的数据压缩
      deleteOriginalAssets: false // 不删除原文件
    })
    // new WebpackObfuscator({
    //   // rotateStringArray: true
    //   // 压缩代码
    //   compact: true,
    //   // 是否启用控制流扁平化(降低1.5倍的运行速度)
    //   controlFlowFlattening: false,
    //   // 随机的死代码块(增加了混淆代码的大小)
    //   deadCodeInjection: false,
    //   // 此选项几乎不可能使用开发者工具的控制台选项卡
    //   debugProtection: false,
    //   // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
    //   debugProtectionInterval: false,
    //   // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
    //   disableConsoleOutput: true,
    //   // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
    //   identifierNamesGenerator: 'hexadecimal',
    //   log: false,
    //   // 是否启用全局变量和函数名称的混淆
    //   renameGlobals: false,
    //   // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
    //   rotateStringArray: true,
    //   // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
    //   selfDefending: true,
    //   // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
    //   unicodeEscapeSequence: false
    // }, [''])
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
