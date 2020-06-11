import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
  withCredentials: true // 跨域请求时发送cookie
})
axios.defaults.withCredentials = true

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    config.data = qs.stringify(config.data)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res instanceof Blob) {
      return res
    }
    if (res.status !== 200) {
      const errMsg = res.msg || '请求失败'
      Message({
        message: errMsg,
        type: 'error',
        duration: 5 * 1000
      })
      if (res.status === 500) {
        // MessageBox.confirm('Token 已失效，是否重新登录', '确认登出', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // })
        if (errMsg === '登录已过期,请重新登陆') {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }
      }
      return Promise.reject(new Error(errMsg))
    } else {
      return res
    }
  },
  error => {
    const { msg } = error.response.data
    Message({
      message: msg || '请求失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
