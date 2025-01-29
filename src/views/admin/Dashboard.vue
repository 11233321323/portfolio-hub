<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <div class="brand">
          <span class="brand-text">后台管理</span>
        </div>
      </div>
      <div class="header-right">
        <div class="nav-menu">
          <button 
            v-for="lang in languages" 
            :key="lang.code"
            class="nav-item"
            :class="{ active: currentLang === lang.code }"
            @click="changeLang(lang.code)"
          >
            {{ lang.name }}
          </button>
          <div class="nav-separator"></div>
          <button @click="handleLogout" class="nav-item">
            退出登录
          </button>
        </div>
      </div>
    </header>
    
    <div class="dashboard-content">
      <section class="edit-section">
        <h2>基本信息</h2>
        <form @submit.prevent="saveBasicInfo" class="form-grid">
          <div class="form-group">
            <label>姓名</label>
            <input v-model="basicInfo.name" type="text">
          </div>
          <div class="form-group">
            <label>头像</label>
            <div class="avatar-uploader">
              <div class="preview" v-if="avatarPreview">
                <img :src="avatarPreview" alt="预览">
                <button @click="removeAvatar" class="remove-preview">×</button>
              </div>
              <div class="upload-btn" @click="triggerFileInput" v-else>
                <i class="upload-icon"></i>
                <span>点击上传头像</span>
              </div>
              <input
                type="file"
                ref="fileInput"
                @change="handleAvatarChange"
                accept="image/*"
                class="hidden-input"
              >
            </div>
          </div>
          <div class="form-group">
            <label>职业描述</label>
            <input v-model="basicInfo.role" type="text">
          </div>
          <div class="form-group">
            <label>个人简介</label>
            <textarea v-model="basicInfo.intro"></textarea>
          </div>
          <div class="form-message" :class="{ 
            'success': message === '保存成功',
            'error': message && message !== '保存成功'
          }" v-if="message">
            {{ message }}
          </div>
          <button type="submit" :disabled="saving">
            {{ saving ? '保存中...' : '保存基本信息' }}
          </button>
        </form>
      </section>

      <section class="edit-section">
        <h2>技能管理</h2>
        <div class="skills-manager">
          <div class="skills-grid">
            <div v-for="(skill, index) in skills" 
                 :key="index" 
                 class="skill-item"
            >
              <input 
                v-model="skills[index]" 
                type="text"
                class="skill-input"
                placeholder="输入技能名称"
              >
              <button @click="removeSkill(index)" 
                      class="remove-btn"
                      title="删除技能"
              >
                ×
              </button>
            </div>
          </div>
          <button @click="addSkill" class="add-btn">
            + 添加技能
          </button>
        </div>
      </section>

      <section class="edit-section">
        <h2>项目管理</h2>
        <div class="projects-manager">
          <div class="projects-list">
            <div v-for="project in projects" 
                 :key="project.id" 
                 class="project-card"
            >
              <div class="project-header">
                <input 
                  v-model="project.title"
                  class="project-title"
                  placeholder="项目名称"
                >
                <button @click="removeProject(project.id)" 
                        class="remove-btn"
                        title="删除项目"
                >
                  ×
                </button>
              </div>
              <textarea 
                v-model="project.description"
                class="project-desc"
                placeholder="项目描述"
              ></textarea>
              <input 
                v-model="project.link"
                class="project-link"
                placeholder="项目链接"
              >
            </div>
          </div>
          <button @click="addProject" class="add-btn">
            + 添加项目
          </button>
        </div>
      </section>

      <section class="edit-section">
        <h2>修改密码</h2>
        <form @submit.prevent="changePassword" class="form-grid">
          <div class="form-group">
            <label>原密码</label>
            <input 
              type="password" 
              v-model="passwordForm.oldPassword"
              placeholder="请输入原密码"
            >
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input 
              type="password" 
              v-model="passwordForm.newPassword"
              placeholder="请输入新密码"
            >
          </div>
          <div class="form-group">
            <label>确认新密码</label>
            <input 
              type="password" 
              v-model="passwordForm.confirmPassword"
              placeholder="请再次输入新密码"
            >
          </div>
          <div class="form-message" :class="{ 
            'success': passwordMessage === '密码修改成功',
            'error': passwordMessage && passwordMessage !== '密码修改成功'
          }" v-if="passwordMessage">
            {{ passwordMessage }}
          </div>
          <button type="submit" :disabled="changingPassword">
            {{ changingPassword ? '修改中...' : '修改密码' }}
          </button>
        </form>
      </section>

      <section class="edit-section">
        <h2>主题设置</h2>
        <div class="theme-manager">
          <div class="preset-themes">
            <div v-for="theme in presetThemes" 
                 :key="theme.name" 
                 class="theme-card"
                 @click="applyTheme(theme)"
            >
              <div class="theme-preview" 
                   :style="{ 
                     backgroundColor: theme.colors.background,
                     backgroundImage: `url(${theme.colors.backgroundImage})`
                   }"
              >
                <div class="color-dot" :style="{ backgroundColor: theme.colors.primary }"></div>
              </div>
              <span class="theme-name">{{ theme.name }}</span>
            </div>
          </div>

          <div class="custom-theme">
            <h3>自定义主题</h3>
            <div class="color-pickers">
              <div class="color-picker">
                <label>主题色</label>
                <input type="color" v-model="currentTheme.primary">
              </div>
              <div class="color-picker">
                <label>背景色</label>
                <input type="color" v-model="currentTheme.background">
              </div>
            </div>

            <div class="bg-uploader">
              <label>背景图片</label>
              <div class="upload-preview" @click="bgFileInput.value.click()">
                <img v-if="bgPreview" :src="bgPreview" alt="背景预览">
                <div v-else class="upload-placeholder">
                  <span>点击上传背景图片</span>
                </div>
              </div>
              <input
                type="file"
                ref="bgFileInput"
                @change="handleBgChange"
                accept="image/*"
                class="hidden-input"
              >
            </div>

            <button class="save-theme-btn" @click="saveCustomTheme">
              保存主题设置
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../../stores/theme'
import { useUserStore } from '../../stores/user'

const authStore = useAuthStore()
const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()

const basicInfo = ref({
  name: '',
  role: '',
  intro: '',
  avatar: ''
})

const skills = ref([
  'JavaScript',
  'Vue.js',
  'Node.js',
  'Python',
  'Docker'
])

const projects = ref([
  {
    id: 1,
    title: '个人网站',
    description: '使用 Vue.js 和 Node.js 构建的现代化网站。',
    link: '#'
  },
  {
    id: 2,
    title: '数据分析工具',
    description: '基于 Python 的数据分析工具。',
    link: '#'
  }
])

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const changingPassword = ref(false)
const passwordMessage = ref('')

const showThemePanel = ref(false)
const currentTheme = ref({
  primary: '#3498db',
  background: '#ffffff',
  backgroundImage: '/bg-default.jpg'
})
const currentLang = ref('zh')

const presetThemes = ref([
  {
    name: '默认蓝',
    colors: {
      primary: '#3498db',
      background: '#ffffff',
      backgroundImage: '/bg-default.jpg'
    }
  },
  {
    name: '暗夜紫',
    colors: {
      primary: '#9b59b6',
      background: '#2c3e50',
      backgroundImage: '/bg-dark.jpg'
    }
  },
  {
    name: '森林绿',
    colors: {
      primary: '#2ecc71',
      background: '#f5f5f5',
      backgroundImage: '/bg-green.jpg'
    }
  },
  {
    name: '海洋蓝',
    colors: {
      primary: '#00a8ff',
      background: '#f8f9fa',
      backgroundImage: '/bg-ocean.jpg'
    }
  }
])

const customColors = ref({
  accent: '#3498db',
  // 其他颜色...
})

const languages = [
  { code: 'zh', name: '中' },
  { code: 'en', name: 'EN' }
]

const fileInput = ref(null)
const avatarPreview = ref(null)
const bgPreview = ref(null)
const bgFileInput = ref(null)

const saving = ref(false)
const message = ref('')

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  avatarPreview.value = null
  basicInfo.value.avatar = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleBgChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      bgPreview.value = e.target.result
      currentTheme.value.backgroundImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const applyTheme = (theme) => {
  currentTheme.value = { ...theme.colors }
  themeStore.setTheme(theme.colors)
}

const saveCustomTheme = () => {
  themeStore.setTheme({
    primary: currentTheme.value.primary,
    background: currentTheme.value.background,
    backgroundImage: currentTheme.value.backgroundImage || '/bg-default.jpg'
  })
}

onMounted(async () => {
  themeStore.initTheme()
  const info = await userStore.loadUserInfo()
  if (info) {
    basicInfo.value = { ...info }
    if (info.avatar) {
      avatarPreview.value = info.avatar
    }
  }
})

const changePassword = async () => {
  // 表单验证
  if (!passwordForm.value.oldPassword) {
    passwordMessage.value = '请输入原密码'
    return
  }
  if (!passwordForm.value.newPassword) {
    passwordMessage.value = '请输入新密码'
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordMessage.value = '两次输入的密码不一致'
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    passwordMessage.value = '新密码长度不能小于6位'
    return
  }

  changingPassword.value = true
  passwordMessage.value = ''

  try {
    await authStore.changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    // 清空表单
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    passwordMessage.value = '密码修改成功'
    
    // 3秒后清除成功消息
    setTimeout(() => {
      passwordMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('修改密码失败:', error)
    passwordMessage.value = error.message || '修改失败，请重试'
  } finally {
    changingPassword.value = false
  }
}

const addSkill = () => {
  skills.value.push('')
}

const removeSkill = (index) => {
  if (skills.value.length > 1) {
    skills.value.splice(index, 1)
  }
}

const addProject = () => {
  projects.value.push({
    id: Date.now(),
    title: '',
    description: '',
    link: ''
  })
}

const removeProject = (id) => {
  if (projects.value.length > 1) {
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
    }
  }
}

const saveBasicInfo = async () => {
  if (!basicInfo.value.name) {
    message.value = '请输入姓名'
    return
  }

  saving.value = true
  message.value = ''

  try {
    // 如果有新的头像，更新头像
    if (avatarPreview.value) {
      basicInfo.value.avatar = avatarPreview.value
    }
    
    await userStore.saveUserInfo(basicInfo.value)
    message.value = '保存成功'
    
    // 延迟清除成功消息
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    console.error('保存失败:', error)
    message.value = '保存失败，请重试'
  } finally {
    saving.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/') // 退出后跳转到主页
}
</script>

<style scoped>
/* 修改后台整体配色 */
.admin-dashboard {
  padding: 6rem 2rem 2rem;
  background: #f8f9fa; /* 浅灰色背景 */
  min-height: 100vh;
}

.dashboard-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white; /* 纯白色背景 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  background: var(--accent-color);
  border-radius: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.brand-text {
  font-size: 1rem;
  font-weight: 500;
  color: white;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 2rem;
}

.nav-item {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: #666;
  font-size: 0.9rem;
  border-radius: 1.5rem;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.nav-item:hover, .nav-item.active {
  color: var(--accent-color);
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-separator {
  width: 1px;
  height: 20px;
  background: var(--border-color);
  margin: 0 0.5rem;
}

.dashboard-content {
  max-width: 1000px;
  margin: 0 auto;
}

.edit-section {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.edit-section h2 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #666;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  background: white;
  color: #333;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.1);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

button {
  padding: 0.8rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background var(--transition-normal);
  font-weight: 500;
}

button:hover:not(:disabled) {
  background: var(--accent-light);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.skills-manager,
.projects-manager {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.skill-item {
  position: relative;
  display: flex;
  align-items: center;
}

.skill-input {
  width: 100%;
  padding: 0.8rem;
  padding-right: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--background-color);
  color: var(--primary-color);
  transition: all var(--transition-normal);
}

.skill-input:focus {
  border-color: var(--accent-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.1);
}

.projects-list {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.project-card {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  transition: all var(--transition-normal);
}

.project-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--accent-color);
}

.project-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.project-title {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.5rem;
  border: none;
  border-bottom: 2px solid var(--border-color);
  background: transparent;
  color: var(--primary-color);
}

.project-title:focus {
  outline: none;
  border-color: var(--accent-color);
}

.project-desc {
  width: 100%;
  min-height: 100px;
  margin: 1rem 0;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--primary-color);
  resize: vertical;
}

.project-link {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--accent-color);
}

.remove-btn {
  padding: 0.4rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.remove-btn:hover {
  background: #dc3545;
  color: white;
}

.add-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: transparent;
  border: 2px dashed var(--border-color);
  color: var(--secondary-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.add-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: rgba(var(--accent-color-rgb), 0.05);
}

/* 深色模式适配 */
[data-theme='dark'] .admin-dashboard {
  background: #1a1a1a;
}

[data-theme='dark'] .dashboard-header {
  background: #242424;
}

[data-theme='dark'] .edit-section {
  background: #242424;
}

[data-theme='dark'] .form-group input,
[data-theme='dark'] .form-group textarea {
  background: #1a1a1a;
  border-color: #333;
  color: #e0e0e0;
}

[data-theme='dark'] .nav-menu {
  background: #1a1a1a;
}

[data-theme='dark'] .nav-item {
  color: #999;
}

[data-theme='dark'] .nav-item:hover,
[data-theme='dark'] .nav-item.active {
  background: #2a2a2a;
  color: var(--accent-color);
}

[data-theme='dark'] .edit-section h2 {
  color: #e0e0e0;
}

[data-theme='dark'] .form-group label {
  color: #999;
}

.avatar-uploader {
  width: 150px;
  height: 150px;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-preview {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
}

.upload-btn {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.upload-btn:hover {
  border-color: var(--accent-color);
  background: rgba(var(--accent-color-rgb), 0.05);
}

.hidden-input {
  display: none;
}

.theme-manager {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preset-themes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.theme-card {
  cursor: pointer;
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.theme-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.theme-preview {
  height: 120px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

.theme-name {
  padding: 0.8rem;
  text-align: center;
  background: var(--surface-color);
  color: var(--primary-color);
}

.custom-theme {
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.color-pickers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.color-picker label {
  display: block;
  margin-bottom: 0.5rem;
}

.bg-uploader {
  margin-top: 1.5rem;
}

.upload-preview {
  width: 100%;
  height: 200px;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.upload-preview:hover {
  border-color: var(--accent-color);
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-color);
}

.save-theme-btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.save-theme-btn:hover {
  background: var(--accent-light);
}

.form-message {
  padding: 0.8rem;
  border-radius: var(--border-radius);
  text-align: center;
  margin-top: 1rem;
}

.form-message.success {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.form-message.error {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}
</style> 