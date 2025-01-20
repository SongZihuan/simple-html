const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const filetool = require("./src/utils/file.js")
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const mode = "production"
const dist_name = "docs"

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
  minifyURLs: true,
}

const HTMMLPlugin = []

const { localPathResult: AllHTMLLocalFile4xx } = filetool.getAllFilePaths(path.resolve(__dirname, 'src/html/error/4xx'))
AllHTMLLocalFile4xx.forEach((filePath) => {
  if (!filePath.endsWith(".html")) {
    return
  }

  if(filePath.includes("signal.html")){
    HTMMLPlugin.push(new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src/html/error/4xx', filePath),  //指定模板文件
      filename: path.join("error/4xx", filePath),
      chunks: ["signal"],
      publicPath: "../../"
    }))
    return
  }

  if(filePath.includes("400.html")){
    HTMMLPlugin.push(new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src/html/error/4xx', filePath),  //指定模板文件
      filename: path.join("error/4xx", filePath),
      chunks: ["common", "err404"],
      publicPath: "../../"
    }))
    return
  }


  HTMMLPlugin.push(new HtmlWebpackPlugin({
    inject:'body',
    template: path.resolve(__dirname, 'src/html/error/4xx', filePath),  //指定模板文件
    filename: path.join("error/4xx", filePath),
    chunks: ["common", "err4xx"],
    publicPath: "../../"
  }))
})

const { localPathResult: AllHTMLLocalFile5xx } = filetool.getAllFilePaths(path.resolve(__dirname, 'src/html/error/5xx'))
AllHTMLLocalFile5xx.forEach((filePath) => {
  if (!filePath.endsWith(".html")) {
    return
  }

  if(filePath.includes("signal.html")){
    HTMMLPlugin.push(new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src/html/error/5xx', filePath),  //指定模板文件
      filename: path.join("error/5xx", filePath),
      chunks: ["signal"],
      publicPath: "../../"
    }))
    return
  }

  HTMMLPlugin.push(new HtmlWebpackPlugin({
    inject:'body',
    template: path.resolve(__dirname, 'src/html/error/5xx', filePath),  //指定模板文件
    filename: path.join("error/5xx", filePath),
    chunks: ["common", "err5xx"],
    publicPath: "../../"
  }))
})

module.exports = {
  mode: mode,

  context: __dirname,

  performance: {
    hints: 'warning', // 或者 'error'，取决于你希望如何处理超出限制的情况
    maxAssetSize: 5000000, // 设置单个资源的最大尺寸，例如5MB
    maxEntrypointSize: 10000000, // 设置入口起点的最大尺寸，例如10MB
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
    err5xx: path.resolve(__dirname, 'src/5xx.js'),
  },

  output: {
    path: path.resolve(__dirname, dist_name),  //打包后的文件存放的地方
    filename: 'js/[name].[hash].bundle.js',  //打包后输出文件的文件名
    chunkFilename: '[name].bundle.js',
    clean: true,
    publicPath: "./",
    charset: true,
  },

  resolve: {
    alias: {
      "@": path.join(__dirname, "src")
    }
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 移除console.log (Github/发布版专属)
            drop_debugger: true, // 移除debugger (Github/发布版专属)
          },
        },
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.css$/, // 匹配.css文件
        use: [
          MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"
        ],
      },
      {
        test:/\.(png|jpg|jpeg|svg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test:/\.(png|jpg|jpeg|svg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name][ext]'
        }
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          exposes: ["$", "jQuery"],
        },
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: './' },
        { from: './config.json', to: './SH_CONFIG.json' },
        { from: './LICENSE', to: './' },
        { from: './LICENSE_CN', to: './' },
      ],
    }),
    ...HTMMLPlugin,
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html", "index.html"),  //指定模板文件
      filename: "index.html",
      chunks: ["common", "index"],
      minify: html_minify,
      publicPath: "./",
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","LICENSE_US.html"),  //指定模板文件
      filename: "LICENSE_US.html",
      chunks: ["common", "license"],
      minify: html_minify,
      publicPath: "./",
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","LICENSE_CN.html"),  //指定模板文件
      filename: "LICENSE_CN.html",
      chunks: ["common", "license"],
      minify: html_minify,
      publicPath: "./",
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","mitorg.html"),  //指定模板文件
      filename: "mitorg.html",
      chunks: ["common", "mitorg"],
      minify: html_minify,
      publicPath: "./",
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","index.new.signal.html"),  //指定模板文件
      filename: "index.new.signal.html",
      chunks: ["common", "new", "signal"],  // 此signal要设置common
      minify: html_minify,
      publicPath: "./",
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","index.new.html"),  //指定模板文件
      filename: "index.new.html",
      chunks: ["common", "new"],
      minify: html_minify,
      publicPath: "./",
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src/html/error/4xx/404.signal.html'),  //指定模板文件
      filename: "404.html",
      chunks: ["common", "signal"],  // 此signal要设置common
      minify: html_minify,
      publicPath: "./",
    }),
    new MiniCssExtractPlugin({
      filename: 'style/[name].[hash].bundle.css',
      chunkFilename: 'css/[id].bundle.css',
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, dist_name),
    },
    compress: true,
    port: 1001,
    open: true,
    hot: false,
  },
};