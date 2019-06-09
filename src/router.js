import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import User from '@/views/users/user.vue'
import Rights from '@/views/rights/rights.vue'
import Roles from '@/views/rights/roles.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'Login' }
    },
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/home',
      component: Home,
      redirect: { name: 'Welcome' },
      children: [
        {
          name: 'Welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'User',
          path: 'users',
          component: User
        },
        {
          name: 'Rights',
          path: 'rights',
          component: Rights
        },
        // 角色列表
        {
          name: 'Roles',
          path: 'roles',
          component: Roles
        }
      ]
    }
  ]
})
