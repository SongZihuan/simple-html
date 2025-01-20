const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const filetool = require("./src/utils/file.js")
const CopyWebpackPlugin = require('copy-webpack-plugin');

const entry = {}
const HTMMLPlugin = []
const mode = "production"
const dist_name = "dist-prod"

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

const { localPathResult: AllHTMLLocalFile4xx } = filetool.getAllFilePaths(path.resolve(__dirname, 'src', 'html', "error", "4xx"))
AllHTMLLocalFile4xx.forEach((filePath) => {
  if (!filePath.endsWith(".html")) {
    return
  }

  if(filePath.includes("400.html")){
    entry["404"] = path.resolve(__dirname, 'src', '404.js')

    HTMMLPlugin.push(new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', 'html', "error", "4xx", "404.html"),  //指定模板文件
      filename: path.join("error", filePath),
      chunks: ["404"],
      minify: html_minify,
    }))
    return
  }

  const name = "ck" + filePath.replace(".html", "").replace("/", "-").replace('\\', '-')
  entry[name] = path.resolve(__dirname, 'src', '4xx.js')

  HTMMLPlugin.push(new HtmlWebpackPlugin({
    inject:'body',
    template: path.resolve(__dirname, 'src', 'html', "error", "4xx", filePath),  //指定模板文件
    filename: path.join("error", filePath),
    chunks: [name],
    minify: html_minify,
  }))
})

const { localPathResult: AllHTMLLocalFile5xx } = filetool.getAllFilePaths(path.resolve(__dirname, 'src', 'html', "error", "5xx"))
AllHTMLLocalFile5xx.forEach((filePath) => {
  if (!filePath.endsWith(".html")) {
    return
  }

  const name = "ck" + filePath.replace(".html", "").replace("/", "-").replace('\\', '-')
  entry[name] = path.resolve(__dirname, 'src', '5xx.js')

  HTMMLPlugin.push(new HtmlWebpackPlugin({
    inject:'body',
    template: path.resolve(__dirname, 'src', 'html', "error", "5xx", filePath),  //指定模板文件
    filename: path.join("error", filePath),
    chunks: [name],
    minify: html_minify,
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
    ...entry,
    index: path.resolve(__dirname, 'src', 'index.js'),
    new: path.resolve(__dirname, 'src', 'new.js'),
    license: path.resolve(__dirname, 'src', 'license.js'),
    mitorg: path.resolve(__dirname, 'src', 'mitorg.js'),
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
    },
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
        { from: 'public', to: './' }, // 这里假设你想将 public 文件夹下的所有内容复制到输出目录的根目录下
        { from: './config.json', to: './SH_CONFIG.json' },
      ],
    }),
    ...HTMMLPlugin,
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html", "index.html"),  //指定模板文件
      filename: "index.html",
      chunks: ["index"],
      minify: html_minify,
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","LICENSE_CN.html"),  //指定模板文件
      filename: "LICENSE_CN.html",
      chunks: ["license"],
      minify: html_minify,
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","LICENSE_EN.html"),  //指定模板文件
      filename: "LICENSE_EN.html",
      chunks: ["license"],
      minify: html_minify,
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","mitorg.html"),  //指定模板文件
      filename: "mitorg.html",
      chunks: ["mitorg"],
      minify: html_minify,
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","index.new.signal.html"),  //指定模板文件
      filename: "index.new.signal.html",
      chunks: ["new"],
      minify: html_minify,
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","index.new.html"),  //指定模板文件
      filename: "index.new.html",
      chunks: ["new"],
      minify: html_minify,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].bundle.css',
      chunkFilename: '[id].bundle.css',
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, dist_name),
    },
    compress: true,
    port: 1001,
    open: true,
    hot: true,
  },
};