import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      name: '前端开发工程师',  // 设置默认值
      role: '开源爱好者',
      intro: '热爱技术，热爱开源，致力于前端开发。',
      avatar: ''
    }
  }),

  actions: {
    async saveUserInfo(info) {
      try {
        this.userInfo = { ...info }
        localStorage.setItem('user_info', JSON.stringify(info))
        
        // 更新主页所有相关元素
        this.updateHomePageElements()
        return true
      } catch (error) {
        console.error('保存用户信息失败:', error)
        throw error
      }
    },

    async loadUserInfo() {
      try {
        const savedInfo = localStorage.getItem('user_info')
        if (savedInfo) {
          const info = JSON.parse(savedInfo)
          this.userInfo = info
          this.updateHomePageElements()
          return info
        }
      } catch (error) {
        console.error('加载用户信息失败:', error)
      }
      return null
    },

    updateHomePageElements() {
      // 更新标题
      document.title = this.userInfo.name || 'Personal Website'
      
      // 更新头像
      const avatarImg = document.querySelector('.avatar img')
      if (avatarImg && this.userInfo.avatar) {
        avatarImg.src = this.userInfo.avatar
      }

      // 更新姓名
      const nameEl = document.querySelector('.name')
      if (nameEl) {
        nameEl.textContent = this.userInfo.name
      }

      // 更新职业描述
      const roleEl = document.querySelector('.role')
      if (roleEl) {
        roleEl.textContent = this.userInfo.role
      }

      // 更新个人简介
      const introEl = document.querySelector('.intro')
      if (introEl) {
        introEl.textContent = this.userInfo.intro
      }
    }
  }
}) 