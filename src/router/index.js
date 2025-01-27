import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const session = localStorage.getItem('session');
    if (!session) {
      next('/login');
      return;
    }

    try {
      const sessionData = JSON.parse(session);
      if (sessionData.expires < Date.now()) {
        localStorage.removeItem('session');
        next('/login');
        return;
      }
      next();
    } catch {
      localStorage.removeItem('session');
      next('/login');
    }
  } else {
    next();
  }
})

export default router 