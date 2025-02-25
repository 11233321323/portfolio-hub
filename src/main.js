import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/variables.css'
import './assets/styles/main.css'
import { useThemeStore } from './stores/theme'
import { useUserStore } from './stores/user'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化主题和用户信息
const themeStore = useThemeStore(pinia)
const userStore = useUserStore(pinia)
const authStore = useAuthStore(pinia)

themeStore.initTheme()
userStore.loadUserInfo()
authStore.init()

app.mount('#app') 