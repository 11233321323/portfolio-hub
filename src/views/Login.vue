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

    await authStore.login(username.value, password.value)

    router.push('/admin')

  } catch (err) {

    console.error('登录失败:', err)

    error.value = err.message || '登录失败，请重试'

  } finally {

    loading.value = false

  }

}

</script>



<style scoped>

.login-container {

  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  background: var(--background-color);

}



.login-form {

  width: 100%;

  max-width: 400px;

  padding: 2rem;

  background: white;

  border-radius: var(--border-radius);

  box-shadow: var(--shadow-md);

}



.form-group {

  margin-bottom: 1.5rem;

}



.form-group label {

  display: block;

  margin-bottom: 0.5rem;

  color: var(--secondary-color);

}



.form-group input {

  width: 100%;

  padding: 0.8rem;

  border: 1px solid var(--border-color);

  border-radius: var(--border-radius);

  font-size: 1rem;

}



.form-message.error {

  color: #dc3545;

  margin-bottom: 1rem;

  font-size: 0.9rem;

}



button {

  width: 100%;

  padding: 0.8rem;

  background: var(--accent-color);

  color: white;

  border: none;

  border-radius: var(--border-radius);

  font-size: 1rem;

  cursor: pointer;

}



button:disabled {

  opacity: 0.7;

  cursor: not-allowed;

}

</style>
