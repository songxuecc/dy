const path = require('path')
const merge = require('webpack-merge')
const os = require('os')
const chalk = require('chalk')
const webpack = require('webpack')

const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const WebpackBar = require('webpackbar')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const StyleLintPlugin = require('stylelint-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const argv = require('yargs-parser')(process.argv.slice(-3))
const mode = argv.mode || 'development'
const mergeConfig = require(`./webpack.${mode}.js`)
const isDev = mode === 'development'
const needAnalyzer = argv.analyzer
const needStyleLint = argv.styleLint
const isEslint = argv.eslint
const log = console.log

const commonConfig = {
  entry: {
    main: path.resolve(__dirname, '../src/main.js')
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
    'fabric': 'fabric',
    'moment': 'moment',
    'vuedraggable': 'vuedraggable'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, '..', 'src'),
      '@productsManagement': path.join(__dirname, '..', 'src/modules/productsManagement'),
      '@customerSetting': path.join(__dirname, '..', 'src/modules/customerSetting'),
      '@migrate': path.join(__dirname, '..', 'src/modules/migrate'),
      '@moreFeatures': path.join(__dirname, '..', 'src/modules/moreFeatures'),
      '@shopDecorate': path.join(__dirname, '..', 'src/modules/shopDecorate')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': argv.mode
    }),
    new WebpackBar({
      name: isDev ? 'development' : 'production',
      color: isDev ? '#00953a' : '#f2a900'
    }),
    new WebpackBuildNotifierPlugin({
      title: `My Project Webpack Build`,
      suppressSuccess: true
    }),
    new FriendlyErrorsWebpackPlugin(),
    new LodashModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HappyPack({
      id: 'babel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            cacheDirectory: true // 启用缓存
          }
        }],
      threadPool: happyThreadPool,
      verbose: true
    }),
    new HappyPack({
      id: 'css',
      loaders: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            import: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            indent: 'postcss',
            plugins: (loader) => [
              require('autoprefixer')()
            ],
            sourceMap: false
          }
        }
      ],
      threadPool: happyThreadPool,
      verbose: true
    }),

    new HappyPack({
      id: 'less',
      loaders: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 3
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            indent: 'postcss',
            plugins: (loader) => [
              require('autoprefixer')()
            ],
            sourceMap: false
          }
        },
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            sourceMap: true
          }
        },
        {
          loader: 'style-resources-loader',
          options: {
            patterns: [
              path.resolve(__dirname, '../src/assets/css/variables/*.less'),
              path.resolve(__dirname, '../src/assets/css/mixins/*.less')
            ],
            injector: (source, resources) => {
              const combineAll = type => resources
                .filter(({ file }) => file.includes(type))
                .map(({ content }) => content)
                .join('')

              return combineAll('variables') + combineAll('mixins') + source
            }
          }
        }
      ],
      threadPool: happyThreadPool,
      verbose: true
    }),
    new HardSourceWebpackPlugin({})
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'cache-loader',
          {
            loader: 'vue-loader',
            options: {
              transformAssetUrls: {
                video: ['src', 'poster'],
                source: 'src',
                img: 'src',
                image: ['xlink:href', 'href'],
                use: ['xlink:href', 'href']
              },
              cssSourceMap: true,
              hotReload: isDev
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loaders: 'happypack/loader?id=babel',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=css'
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=less'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [path.join(__dirname, '..', 'src/assets/icon')],
        exclude: /node_modules/,
        options: {
          symbolId: '[name]',
          name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          limit: 10000,
          name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          limit: 10000,
          name: path.posix.join('static', 'media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      name: true, // 自动处理文件名
      chunks: 'all',
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          name: 'vendors',
          chunks: 'initial'
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 2,
          priority: 5,
          test: path.join(__dirname, '..', 'src/components'),
          reuseExistingChunk: true
        }
      }
    }
  }
}

// js lint
if (isEslint) {
  log(chalk.white('eslint: ' + isEslint))
  commonConfig.module.rules.push({
    test: /\.(js|vue)$/,
    exclude: /node_modules/,
    loader: 'eslint-loader'
  })
}

// style lint
if (needStyleLint) {
  log(chalk.white('styleLint: ' + needStyleLint))
  commonConfig.plugins.push(new StyleLintPlugin({
    files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}']
  }))
}

// 打包分析
if (needAnalyzer) {
  log(chalk.white('analyzer: ' + needAnalyzer))
  commonConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    defaultSizes: 'parsed',
    generateStatsFile: false
  }))
}

if (isDev) {
  commonConfig.plugins.push(
    new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/
      }
    ])
  )
}

const common = merge(commonConfig, mergeConfig)
module.exports = common
