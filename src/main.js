/* eslint-disable space-before-function-paren */
/*
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-05-20 11:46:00
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 15:25:33
 */
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import './assets/custom-theme/main.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// http
import { http, HTTP_GET, HTTP_POST } from './api/common.js'

import * as urlPath from './api/url-path'

// common vue
import TableFoot from './components/Common/TableFoot.vue'
import TableHeader from './components/Common/TableHeader.vue'
import { level } from 'province-city-china/data'

Vue.component('TableFoot', TableFoot)
Vue.component('TableHeader', TableHeader)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$http = http
Vue.prototype.$privinceData = level
Vue.prototype.HTTP_GET = HTTP_GET
Vue.prototype.HTTP_POST = HTTP_POST
Vue.prototype.$urlPath = urlPath
Vue.prototype.$roles = JSON.parse(localStorage.getItem('roles'))[0]

Vue.config.productionTip = false

Vue.prototype.$successMsg = function (message = '') {
  this.$message({
    message: message,
    type: 'success'
  })
}

Vue.prototype.$errorMsg = function (message = '') {
  this.$message.error(message)
}

Vue.prototype.$warningConfirm = function (message = '', handlerFunction = null) {
  this.$confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (handlerFunction) {
      handlerFunction()
    }
  })
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
