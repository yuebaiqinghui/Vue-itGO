import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
export const login = (obj, callback) => {
  return axios.post('login', obj)
    .then(result => {
      return result.data
    })
}
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  var token = localStorage.getItem('itcastpro_token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 获取用户数据
export const getUserList = (pa) => {
  return axios.get('users', {
    params: pa
  })
    .then((result) => {
      return result.data
    })
}
