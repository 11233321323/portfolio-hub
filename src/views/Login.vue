<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>后台登录</h2>
      <div class="form-group">
        <label>用户名</label>
        <input 
          type="text" 
          v-model="username"
          placeholder="请输入用户名"
          required
        >
      </div>
      <div class="form-group">
        <label>密码</label>
        <input 
          type="password" 
          v-model="password"
          placeholder="请输入密码"
          required
        >
      </div>
      <div class="form-message error" v-if="error">
        {{ error }}
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const success = await authStore.login(username.value, password.value)
    if (success) {
      router.push('/admin')
    }
  } catch (err) {
    error.value = err.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script> 