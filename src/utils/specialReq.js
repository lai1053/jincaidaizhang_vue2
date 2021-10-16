import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'

// 创建axios实例
axios.defaults.withCredentials = true
const service = axios.create({
  baseURL: process.env.BASE_API,  //测试：'http://47.106.68.247:80/web-bovms', // api的base_url
  // timeout: 20000                  // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  /* if (store.getters.token) {
    config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  } */
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if (!response.data) {
      MessageBox.alert('请求错误！', '提示', {
        confirmButtonText: '确定',
        type: 'error',
        callback: action => {}
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
