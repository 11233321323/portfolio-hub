import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AdminLogin from '../views/admin/Login.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/admin',
      component: AdminLogin
    },
    {
      path: '/admin/dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // 需要认证的路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } 
  // 登录页面
  else if (to.path === '/login') {
    if (isAuthenticated) {
      next('/admin')
    } else {
      next()
    }
  }
  else {
    next()
  }
})

export default router 