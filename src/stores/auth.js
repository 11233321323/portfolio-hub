import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: null,
    user: null
  }),

  actions: {
    async login(username, password) {
      try {
        // 这里是临时的判断，实际应该调用后端 API
        if (username === 'admin' && password === 'admin123') {
          this.token = 'dummy_token'
          this.isAuthenticated = true
          this.user = { username }
          localStorage.setItem('admin_token', this.token)
          localStorage.setItem('admin_user', JSON.stringify(this.user))
          return true
        }
        return false
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    async changePassword(oldPassword, newPassword) {
      try {
        const response = await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ oldPassword, newPassword })
        })
        
        if (!response.ok) {
          throw new Error('Failed to change password')
        }
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.token = null
      this.isAuthenticated = false
      this.user = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    },

    checkAuth() {
      const token = localStorage.getItem('admin_token')
      const user = localStorage.getItem('admin_user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    }
  }
}) 