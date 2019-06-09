import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么?获取token,传递
  // 1.获取token
  var token = localStorage.getItem('itcastpro_token')
  if (token) {
    // 2.在发送请求的时候传递token
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 获取所有角色列表
export const getAllRoleList = () => {
  return axios.get('roles')
    .then((result) => {
      return result.data
    })
}

export const editRole = obj => {
  console.log(obj)
  return axios.put(`users/${obj.id}/role`, obj)
    .then(result => {
      console.log(result)
      return result.data
    })
}
export const removeRightByUserId = (roleid, rightid) => {
  return axios.delete(`roles/${roleid}/rights/${rightid}`)
}
export const addRole = params => {
  return axios({
    method: 'post',
    url: 'roles',
    data: params
  })
}
// 实现角色授权提交
export const grantRoleSubmit = (roleid, ids) => {
  return axios({
    url: `roles/${roleid}/rights`,
    method: 'post',
    data: { rids: ids }
  })
}
