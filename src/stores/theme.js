import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: {
      primary: '#3498db',
      background: '#ffffff',
      backgroundImage: '/bg-default.jpg'
    }
  }),

  actions: {
    setTheme(theme) {
      this.currentTheme = { ...theme }
      // 保存到本地存储
      localStorage.setItem('site_theme', JSON.stringify(theme))
      // 应用主题
      this.applyTheme()
    },

    applyTheme() {
      // 应用主题色
      document.documentElement.style.setProperty('--accent-color', this.currentTheme.primary)
      document.documentElement.style.setProperty('--background-color', this.currentTheme.background)
      document.documentElement.style.setProperty('--accent-light', this.getLighterColor(this.currentTheme.primary))
      // 应用背景图
      if (this.currentTheme.backgroundImage) {
        document.body.style.backgroundImage = `url(${this.currentTheme.backgroundImage})`
      }
    },

    initTheme() {
      // 从本地存储加载主题
      const savedTheme = localStorage.getItem('site_theme')
      if (savedTheme) {
        this.currentTheme = JSON.parse(savedTheme)
        this.applyTheme()
      }
    },

    // 辅助方法：获取更亮的颜色（用于悬停效果）
    getLighterColor(hex) {
      let r = parseInt(hex.slice(1, 3), 16)
      let g = parseInt(hex.slice(3, 5), 16)
      let b = parseInt(hex.slice(5, 7), 16)
      
      r = Math.min(255, r + 20)
      g = Math.min(255, g + 20)
      b = Math.min(255, b + 20)
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
  }
}) 