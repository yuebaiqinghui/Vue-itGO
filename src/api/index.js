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
export const getUserList = pa => {
  return axios.get('users', {
    params: pa
  })
    .then(result => {
      return result.data
    })
}
// 用户提交
export const editUser = obj => {
  return axios.put(`users/${obj.id}`, obj)
    .then(result => {
      return result.data
    })
}
// 删除用户
export const delUserById = id => {
  return axios.delete(`users/${id}`)
    .then(result => {
      return result.data
    })
}
// 用户状态改变
export const updateUserStatuById = (id, type) => {
  return axios.put(`users/${id}/state/${type}`)
    .then(result => {
      return result.data
    })
}
export const addUser = obj => {
  return axios.post('users', obj)
    .then(result => {
      return result.data
    })
}
