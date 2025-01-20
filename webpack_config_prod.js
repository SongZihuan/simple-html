const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const filetool = require("./src/utils/file.js")

const entry = {}
const HTMMLPlugin = []
const dist_name = "dist-prod"

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
      chunks: ["404"]
    }))
    return
  }

  const name = "ck" + filePath.replace(".html", "").replace("/", "-").replace('\\', '-')
  entry[name] = path.resolve(__dirname, 'src', '4xx.js')

  HTMMLPlugin.push(new HtmlWebpackPlugin({
    inject:'body',
    template: path.resolve(__dirname, 'src', 'html', "error", "4xx", filePath),  //指定模板文件
    filename: path.join("error", filePath),
    chunks: [name]
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
    chunks: [name]
  }))
})

module.exports = {
  mode: 'production',

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
    ...HTMMLPlugin,
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html", "index.html"),  //指定模板文件
      filename: "index.html",
      chunks: ["index"]
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","LICENSE_CN.html"),  //指定模板文件
      filename: "LICENSE_CN.html",
      chunks: ["license"]
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","LICENSE_EN.html"),  //指定模板文件
      filename: "LICENSE_EN.html",
      chunks: ["license"]
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","mitorg.html"),  //指定模板文件
      filename: "mitorg.html",
      chunks: ["mitorg"]
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","index.new.signal.html"),  //指定模板文件
      filename: "index.new.signal.html",
      chunks: ["new"]
    }),
    new HtmlWebpackPlugin({
      inject:'body',
      template: path.resolve(__dirname, 'src', "html","index.new.html"),  //指定模板文件
      filename: "index.new.html",
      chunks: ["new"]
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
    port: 1002,
    open: true,
    hot: false,
  },
};