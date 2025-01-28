import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.scss'
import './assets/styles/fontawesome.scss'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 处理控制台警告
console.warn = () => {} 