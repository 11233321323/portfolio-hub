<template>
  <div class="login-container">
    <div class="login-card">
      <h1>后台管理</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="username" required>
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" v-model="password" required>
        </div>
        <button type="submit">登 录</button>
      </form>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

const SALT = 'portfolio-hub-2024'; // 加盐增加安全性

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      maxAttempts: 5,
      attemptCount: 0,
      lastAttemptTime: 0
    }
  },
  methods: {
    handleLogin() {
      // 检查登录频率
      const now = Date.now();
      if (now - this.lastAttemptTime < 2000) {
        alert('请稍后再试');
        return;
      }
      this.lastAttemptTime = now;

      // 检查尝试次数
      if (this.attemptCount >= this.maxAttempts) {
        alert('登录尝试次数过多，请稍后再试');
        return;
      }

      // 简单的密码加密
      const hashedPassword = CryptoJS.SHA256(this.password + SALT).toString();
      
      if (this.username === 'admin' && 
          hashedPassword === CryptoJS.SHA256('admin123' + SALT).toString()) {
        // 生成简单的会话信息
        const session = {
          username: this.username,
          expires: Date.now() + 24 * 60 * 60 * 1000, // 24小时后过期
          token: CryptoJS.lib.WordArray.random(16).toString()
        };

        // 存储会话信息
        localStorage.setItem('session', JSON.stringify(session));
        this.attemptCount = 0;
        this.$router.push('/admin');
      } else {
        this.attemptCount++;
        alert('用户名或密码错误');
      }
    }
  },
  mounted() {
    // 检查现有会话
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.expires > Date.now()) {
          this.$router.push('/admin');
        } else {
          localStorage.removeItem('session');
        }
      } catch {
        localStorage.removeItem('session');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  padding: 1rem;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #2c3e50;
    font-size: 1.8rem;
  }
}

.login-form {
  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }

    input {
      width: 100%;
      padding: 0.8rem;
      border: 2px solid #eee;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #3498db;
      }
    }
  }

  button {
    width: 100%;
    padding: 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 