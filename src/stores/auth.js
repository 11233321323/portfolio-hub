import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
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

    async login(password) {
      try {
        const savedPassword = localStorage.getItem('password')
        if (!savedPassword) {
          // 首次使用，设置默认密码为 admin123
          localStorage.setItem('password', 'admin123')
        }
        
        if (password === localStorage.getItem('password')) {
          const token = 'token_' + Date.now()
          localStorage.setItem('token', token)
          this.token = token
          return true
        }
        throw new Error('密码错误')
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },

    logout() {
      localStorage.removeItem('token')
      this.token = null
    },

    // 添加初始化方法
    init() {
      // 如果还没有设置密码，设置默认密码
      if (!localStorage.getItem('password')) {
        localStorage.setItem('password', 'admin123')
      }
    }
  }
}) 