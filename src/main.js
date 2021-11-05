/** init domain config **/
import './config'

import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store'
import { VueAxios } from '@/utils/request'

import Antd, { version } from 'ant-design-vue'
console.log('ant-design-vue version:', version)

import 'ant-design-vue/dist/antd.less';  // or 'ant-design-vue/dist/antd.less'
// 设备弹窗使用的的css变量定义
import '@assets/modal.css'

// import '@/permission' // 权限控制（参考swan-hostings-vue），工程当前未引入
import '@/utils/filter'   // 时间等基础格式过滤器

import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_PAGE,
  PROJECTINFO
} from "@/store/mutation-types"
import config from '@/defaultSettings'

Vue.config.productionTip = false
Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
