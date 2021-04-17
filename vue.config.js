const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let resolve = (dir) => {
  return path.join(__dirname, "./", dir);
};

module.exports = {
  // 基本路径
  publicPath: "./",
  // 构建时打包文件存放位置
  outputDir: "dist",
  // 静态文件存放目录
  assetsDir: "static",
  // 指定生成的index.html生成的路径
  indexPath: "index.html",
  // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  filenameHashing: true,
  // 多页面打包配置
  // pages: {
  //   index: {
  //     // 入口文件
  //     entry: "",
  //     // 模版文件
  //     template: "",
  //     // 输出文件
  //     filename: "",
  //     // template中<title><%= htmlWebpackPlugin.options.title %></title>的值
  //     title: "",
  //     // 提取出来的通用chunk和vendor chunk
  //     chunks: [],
  //   },
  // },
  // 是否保存时用eslint校验
  lintOnSave: true,
  // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  runtimeCompiler: false,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,
  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
  // corssorigin: false,

  // webpack相关配置
  // 会通过 webpack-merge 合并到最终的配置中
  configureWebpack: () => {
    const myConfig = {};
    if (process.env.NODE_ENV === "production") {
      // 去掉注释
      myConfig.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false, // 去掉注释
            },
            compress: {
              warnings: false,
              drop_console: false,
              drop_debugger: false,
              pure_funcs: ["console.log"], // 移除console
            },
          },
        }),
        new HtmlWebpackPlugin({
          filename: "index.html",
          template: resolve("/index.html"),
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            minifyCSS: true,
          },
          inject: true,
        }),
        new CleanWebpackPlugin()
      );
    }
    return myConfig;
  },
  // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"));
  },

  // css相关配置
  css: {
    // 是否将所有的css及其预处理文件开启css modules, 不影响*.vue文件
    // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。设置为true后你就可以去掉文件名中的.module
    // 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。 v4弃用改为css.requireModuleExtension
    requireModuleExtension: false,
    // 是否将组件的css单独提取到一个css文件中
    extract: true,
    sourceMap: false,
    // loaderOptions: {
    //   saaa: {
    //     prependData: "@import '~url';",
    //   },
    //   less: {
    //     lessOptions: {

    //     }
    //   }
    // },
  },

  // https://webpack.docschina.org/configuration/dev-server/
  devServer: {
    host: "127.0.0.1",
    port: "8080",
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // 默认true情况下，将不接受在 HTTPS 上运行且证书无效的后端服务器
        secure: false,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
    // before: () => {},
    // after: () => {},
  },

  // 构建时开启多进程处理 babel 编译
  parallel: require("os").cpus().length > 1,
};
