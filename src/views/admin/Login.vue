<template>
  <div class="admin-login">
    <div class="login-card">
      <div class="logo">
        <svg viewBox="0 0 24 24" class="logo-icon">
          <circle cx="12" cy="12" r="10" fill="currentColor"/>
          <circle cx="9" cy="12" r="2" fill="white"/>
          <circle cx="15" cy="12" r="2" fill="white"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
        </svg>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input 
            type="text" 
            v-model="username"
            placeholder="请输入用户名"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label>密码</label>
          <input 
            type="password" 
            v-model="password"
            placeholder="请输入密码"
            class="form-input"
          >
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

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
      router.push('/admin/dashboard')
    } else {
      error.value = '用户名或密码错误'
    }
  } catch (err) {
    error.value = '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
}

.login-card {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-md);
}

.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  color: var(--accent-color);
}

.login-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--background-color);
  color: var(--primary-color);
  transition: border-color var(--transition-normal);
}

.form-input:focus {
  border-color: var(--accent-color);
  outline: none;
}

.login-btn {
  width: 100%;
  padding: 0.8rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background var(--transition-normal);
  font-weight: 500;
}

.login-btn:hover:not(:disabled) {
  background: var(--accent-light);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
</style> 