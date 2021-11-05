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

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
