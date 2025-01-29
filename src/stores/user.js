import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      name: '',
      role: '',
      intro: '',
      avatar: ''
    },
    skills: [],
    projects: []
  }),

  actions: {
    async saveUserInfo(info) {
      try {
        const { data, error } = await supabase
          .from('user_info')
          .upsert({ id: 1, ...info })
          .select()
          .single()

        if (error) throw error
        
        this.userInfo = data
        return data
      } catch (error) {
        console.error('保存失败:', error)
        throw error
      }
    },

    async loadUserInfo() {
      try {
        const { data, error } = await supabase
          .from('user_info')
          .select('*')
          .single()

        if (error) throw error

        if (data) {
          this.userInfo = data
        }
        return data
      } catch (error) {
        console.error('加载失败:', error)
      }
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