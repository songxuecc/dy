const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const chalk = require('chalk')
// const os = require('os');

const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const WebpackBar = require('webpackbar')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const argv = require('yargs-parser')(process.argv.slice(-3))
const mode = argv.mode || 'development'
const mergeConfig = require(`./webpack.${mode}.js`)
const isDev = mode === 'development'
// const log = console.log;

const commonConfig = {
  entry: {
    main: path.resolve(__dirname, '../src/main.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    publicPath: '/'
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
    new WebpackBar({
      name: isDev ? 'development' : 'production',
      color: isDev ? '#00953a' : '#f2a900'
    }),
    new WebpackBuildNotifierPlugin({
      title: `My Project Webpack Build`,
      suppressSuccess: true
    }),
    new FriendlyErrorsWebpackPlugin(),
    new VueLoaderPlugin()

  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          transformAssetUrls: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          },
          cacheBusting: true,
          cssSourceMap: true
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              import: true
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3
            }
          },
          {
            loader: 'postcss-loader'
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
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [path.join(__dirname, '..', 'src/assets/icon')],
        options: {
          symbolId: '[name]',
          name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        // include:[resolve('src/assets/icon')],
        options: {
          limit: 10000,
          name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
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
  }
}

// if (isEslint) {
//     log(chalk.white('eslint: ' + isEslint));
//     log(chalk.white('enviroment: ' + mode));
//     log(chalk.white('threadPool: ' + os.cpus().length));
//     commonConfig.module.rules.unshift({
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         loader: "eslint-loader"
//     })
// }

const common = merge(commonConfig, mergeConfig)
module.exports = common
