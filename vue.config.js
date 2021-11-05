const path = require('path')
const CompressionPlugin = require("compression-webpack-plugin")

function resolve(dir) {
  return path.join(__dirname, dir)
}

// page title
const name = process.env.VUE_APP_PLATFORM_NAME

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463
   */
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  //打包app时放开该配置
  //publicPath:'./',
  // publicPath:process.env.NODE_ENV === 'production'?'/co-sim-vue/':'/',
  publicPath:process.env.NODE_ENV === 'production'?'/co-sim-vue/':'/',
  configureWebpack: config => {
    config.name = name
    //生产环境取消 console.log
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')

    config.resolve.alias
        .set('@$', resolve('src'))
        .set('@api', resolve('src/api'))
        .set('@assets', resolve('src/assets'))
        .set('@comp', resolve('src/components'))
        .set('@views', resolve('src/views'))

    //生产环境，开启js\css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin').use(new CompressionPlugin({
        test: /\.(js|css|less)$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      }))
    }

    // 配置 webpack 识别 markdown 为普通的文件
    config.module
        .rule('markdown')
        .test(/\.md$/)
        .use()
        .loader('file-loader')
        .end()

    // 编译vxe-table包里的es6代码，解决IE11兼容问题
    config.module
        .rule('vxe')
        .test(/\.js$/)
        .include
        .add(resolve('node_modules/vxe-table'))
        .add(resolve('node_modules/vxe-table-plugin-antd'))
        .end()
        .use()
        .loader('babel-loader')
        .end()

  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          'primary-color': '#1890FF',
          'link-color': '#1890FF',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    host:'0.0.0.0',
    port: 3001,
    proxy: {
      //  '/swan-hosting': {
      //     target: 'http://172.72.101.252:17002', //mock API接口系统
      //     ws: false,
      //     changeOrigin: true,
      //     pathRewrite: {
      //       '/swan-hosting': ''  //默认所有请求都加了jeecg-boot前缀，需要去掉
      //     }
      //   },
      '/co-sim': {
        target: 'http://100.10.10.252:7005',   //'http://100.10.10.219:19001', //请求本地 需要swan-hosting后台项目
        // ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/co-sim': ''
        }
      },
    }
  },

  lintOnSave: false
}
