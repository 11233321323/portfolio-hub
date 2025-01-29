import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  actions: {
    async changePassword({ oldPassword, newPassword }) {
      try {
        // 验证旧密码是否正确
        const savedPassword = localStorage.getItem('password')
        if (savedPassword !== oldPassword) {
          throw new Error('原密码不正确')
        }

        // 保存新密码
        localStorage.setItem('password', newPassword)
        return true
      } catch (error) {
        console.error('修改密码失败:', error)
        throw error
      }
    },

    async login(username, password) {
      try {
        // 验证用户名
        if (username !== 'admin') {
          throw new Error('用户名错误')
        }

        const savedPassword = localStorage.getItem('password')
        if (!savedPassword) {
          // 首次使用，设置默认密码
          localStorage.setItem('password', 'admin123')
        }
        
        if (password === localStorage.getItem('password')) {
          const token = 'token_' + Date.now()
          this.token = token
          this.user = { username }
          this.isAuthenticated = true
          
          // 保存到本地存储
          localStorage.setItem('token', token)
          localStorage.setItem('user', username)
          return true
        }
        throw new Error('密码错误')
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = { username: user }
        this.isAuthenticated = true
        return true
      }
      return false
    },

    init() {
      // 如果还没有设置密码，设置默认密码
      if (!localStorage.getItem('password')) {
        localStorage.setItem('password', 'admin123')
      }
      this.checkAuth()
    }
  }
}) 