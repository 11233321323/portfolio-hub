import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    lang: 'zh',
    theme: 'light'
  }),
  
  actions: {
    setLang(lang) {
      this.lang = lang
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', this.theme)
    }
  }
}) 