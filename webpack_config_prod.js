import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import filetool from './src/utils/file.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const mode = 'production'
const dist_name = 'dist-prod'

const html_minify = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true
}

const HTMMLPlugin = []

const { localPathResult: AllHTMLLocalFile4xx } = filetool.getAllFilePaths(path.resolve(__dirname, 'src/html/error/4xx'))
AllHTMLLocalFile4xx.forEach((filePath) => {
  if (!filePath.endsWith('.html')) {
    return
  }

  if (filePath.includes('signal.html')) {
    HTMMLPlugin.push(
      new HtmlWebpackPlugin({
        inject: 'body',
        template: path.resolve(__dirname, 'src/html/error/4xx', filePath), //指定模板文件
        filename: path.join('error/4xx', filePath),
        chunks: ['signal'],
        publicPath: '../../'
      })
    )
    return
  }

  if (filePath.includes('400.html')) {
    HTMMLPlugin.push(
      new HtmlWebpackPlugin({
        inject: 'body',
        template: path.resolve(__dirname, 'src/html/error/4xx', filePath), //指定模板文件
        filename: path.join('error/4xx', filePath),
        chunks: ['common', 'err404'],
        publicPath: '../../'
      })
    )
    return
  }

  HTMMLPlugin.push(
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, 'src/html/error/4xx', filePath), //指定模板文件
      filename: path.join('error/4xx', filePath),
      chunks: ['common', 'err4xx'],
      publicPath: '../../'
    })
  )
})

const { localPathResult: AllHTMLLocalFile5xx } = filetool.getAllFilePaths(path.resolve(__dirname, 'src/html/error/5xx'))
AllHTMLLocalFile5xx.forEach((filePath) => {
  if (!filePath.endsWith('.html')) {
    return
  }

  if (filePath.includes('signal.html')) {
    HTMMLPlugin.push(
      new HtmlWebpackPlugin({
        inject: 'body',
        template: path.resolve(__dirname, 'src/html/error/5xx', filePath), //指定模板文件
        filename: path.join('error/5xx', filePath),
        chunks: ['signal'],
        publicPath: '../../'
      })
    )
    return
  }

  HTMMLPlugin.push(
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, 'src/html/error/5xx', filePath), //指定模板文件
      filename: path.join('error/5xx', filePath),
      chunks: ['common', 'err5xx'],
      publicPath: '../../'
    })
  )
})

const config = {
  mode: mode,

  context: __dirname,

  performance: {
    hints: 'warning', // 或者 'error'，取决于你希望如何处理超出限制的情况
    maxAssetSize: 5000000, // 设置单个资源的最大尺寸，例如5MB
    maxEntrypointSize: 10000000 // 设置入口起点的最大尺寸，例如10MB
  },

  entry: {
    common: path.resolve(__dirname, 'src/common.js'),
    index: path.resolve(__dirname, 'src/index.js'),
    signal: path.resolve(__dirname, 'src/signal.js'),
    new: path.resolve(__dirname, 'src/new.js'),
    license: path.resolve(__dirname, 'src/license.js'),
    mitorg: path.resolve(__dirname, 'src/mitorg.js'),
    err4xx: path.resolve(__dirname, 'src/4xx.js'),
    err404: path.resolve(__dirname, 'src/404.js'),
    err5xx: path.resolve(__dirname, 'src/5xx.js')
  },

  output: {
    path: path.resolve(__dirname, dist_name), //打包后的文件存放的地方
    filename: 'js/[name].[fullhash].bundle.js', //打包后输出文件的文件名
    chunkFilename: '[name].bundle.js',
    clean: true,
    charset: true,
    publicPath: '/'
  },

  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|mjs|cjs)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 8KB 以下的文件将被转换为 Data URL
              fallback: 'file-loader',
              outputPath: 'images', // 类似于 file-loader 的配置
              name: '[name].[fullhash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(mp4|m4v|avi|mov|qt|wmv|mkv|flv|webm|mpeg|mpg|3gp|3g2)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 8KB 以下的文件将被转换为 Data URL
              fallback: 'file-loader',
              outputPath: 'videos', // 类似于 file-loader 的配置
              name: '[name].[fullhash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 8KB 以下的文件将被转换为 Data URL
              fallback: 'file-loader',
              outputPath: 'fonts', // 类似于 file-loader 的配置
              name: '[name].[fullhash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: './' },
        { from: './config.json', to: './SH_CONFIG.json' },
        { from: './LICENSE', to: './' },
        { from: './LICENSE_CN', to: './' }
      ]
    }),
    ...HTMMLPlugin,
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, 'src', 'html', 'index.html'), //指定模板文件
      filename: 'index.html',
      chunks: ['common', 'index'],
      minify: html_minify,
      publicPath: './'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, 'src', 'html', 'LICENSE_US.html'), //指定模板文件
      filename: 'LICENSE_US.html',
      chunks: ['common', 'license'],
      minify: html_minify,
      publicPath: './'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, 'src/html/LICENSE_CN.html'), //指定模板文件
      filename: 'LICENSE_CN.html',
      chunks: ['common', 'license'],
      minify: html_minify,
      publicPath: './'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, 'src', 'html', 'mitorg.html'), //指定模板文件
      filename: 'mitorg.html',
      chunks: ['common', 'mitorg'],
      minify: html_minify,
      publicPath: './'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, 'src', 'html', 'index.new.signal.html'), //指定模板文件
      filename: 'index.new.signal.html',
      chunks: ['common', 'new', 'signal'], // 此signal要设置common
      minify: html_minify,
      publicPath: './'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, 'src', 'html', 'index.new.html'), //指定模板文件
      filename: 'index.new.html',
      chunks: ['common', 'new'],
      minify: html_minify,
      publicPath: './'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, 'src/html/error/4xx/404.signal.html'), //指定模板文件
      filename: '404.html',
      chunks: ['common', 'signal'], // 此signal要设置common
      minify: html_minify,
      publicPath: './'
    }),
    new MiniCssExtractPlugin({
      filename: 'style/[name].[hash].bundle.css',
      chunkFilename: 'css/[id].bundle.css'
    })
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, dist_name)
    },
    compress: true,
    port: 1001,
    open: true,
    hot: true
  }
}

export default config
