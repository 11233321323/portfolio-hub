<template>
  <div class="home">
    <!-- 导航栏 -->
    <nav class="nav">
      <div class="nav-links">
        <div class="nav-menu">
          <a href="#about" class="nav-item">{{ t('nav.about') }}</a>
          <a href="#skills" class="nav-item">{{ t('nav.skills') }}</a>
          <a href="#projects" class="nav-item">{{ t('nav.projects') }}</a>
        </div>
      </div>
      <div class="nav-right">
        <div class="lang-switch">
          <button 
            class="lang-btn" 
            :class="{ active: appStore.lang === 'zh' }" 
            @click="appStore.setLang('zh')"
          >中</button>
          <span class="lang-separator">/</span>
          <button 
            class="lang-btn" 
            :class="{ active: appStore.lang === 'en' }" 
            @click="appStore.setLang('en')"
          >EN</button>
        </div>
        <button class="theme-btn" @click="appStore.toggleTheme">
          <i class="theme-icon" :class="appStore.theme"></i>
        </button>
      </div>
    </nav>

    <!-- 内容区域 -->
    <div class="container">
      <!-- 个人信息区域 -->
      <section class="hero-section">
        <div class="avatar-container">
          <img :src="userStore.userInfo.avatar || '/default-avatar.jpg'" alt="头像" class="avatar">
        </div>
        <h1 class="name">{{ userStore.userInfo.name }}</h1>
        <p class="role">{{ userStore.userInfo.role }}</p>
        <p class="intro">{{ userStore.userInfo.intro }}</p>
      </section>

      <!-- 技能专长 -->
      <section id="skills" class="section">
        <h1 class="section-title">{{ t('sections.skills') }}</h1>
        <div class="skills-section">
          <SkillTag v-for="skill in skills" 
                   :key="skill" 
                   :name="skill" />
        </div>
      </section>

      <!-- 项目展示 -->
      <section id="projects" class="section">
        <h1 class="section-title">{{ t('sections.projects') }}</h1>
        <div class="projects-section">
          <ProjectCard v-for="project in projects" 
                      :key="project.id" 
                      :project="project" />
        </div>
      </section>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SkillTag from '../components/SkillTag.vue'
import ProjectCard from '../components/ProjectCard.vue'
import Footer from '../components/Footer.vue'
import { useAppStore } from '../stores/app'
import { useUserStore } from '../stores/user'

const appStore = useAppStore()
const userStore = useUserStore()

const skills = ref(['JavaScript', 'Vue.js', 'Node.js', 'Python', 'Docker'])
const projects = ref([
  {
    id: 1,
    title: '个人网站',
    description: '使用 Vue.js 和 Node.js 构建的现代化网站。',
    cover: '/project1.jpg',
    link: '#'
  },
  {
    id: 2,
    title: '数据分析工具',
    description: '基于 Python 的数据分析工具。',
    cover: '/project2.jpg',
    link: '#'
  }
])

// 修改国际化实现
const messages = {
  zh: {
    nav: {
      about: '关于我',
      skills: '技能专长',
      projects: '项目展示'
    },
    hero: {
      role: '前端开发工程师 / 开源爱好者',
      intro: '你好! 我是一名充满激情的开发者。热爱技术，专注于前端开发，同时对开源充满热情。'
    },
    sections: {
      skills: '技能专长',
      projects: '项目展示'
    }
  },
  en: {
    nav: {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects'
    },
    hero: {
      role: 'Frontend Developer / Open Source Enthusiast',
      intro: 'Hello! I am a passionate developer focused on frontend development and open source.'
    },
    sections: {
      skills: 'Skills',
      projects: 'Projects'
    }
  }
}

const t = (key) => {
  const keys = key.split('.')
  let result = messages[appStore.lang]
  for (const k of keys) {
    result = result[k]
  }
  return result
}

const scrollToSection = (href) => {
  const el = document.querySelector(href)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  userStore.loadUserInfo()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: transparent;
  z-index: 100;
}

.nav-links {
  display: flex;
  gap: 3rem;
}

.nav-menu {
  display: flex;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(12px);
  padding: 0.5rem;
  border-radius: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-item {
  color: var(--secondary-color);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.5rem 1.2rem;
  border-radius: 1.5rem;
  transition: all var(--transition-normal);
}

.nav-item:hover {
  color: var(--primary-color);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.nav-right {
  display: flex;
  gap: 1rem;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--nav-bg);
  backdrop-filter: blur(12px);
  padding: 0.3rem 0.8rem;
  border-radius: 1.5rem;
}

.lang-btn {
  padding: 0.2rem 0.4rem;
  border: none;
  background: transparent;
  color: var(--secondary-color);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 0.9rem;
  border-radius: 0.8rem;
}

.lang-btn:hover {
  color: var(--primary-color);
}

.lang-btn.active {
  color: var(--primary-color);
  background: var(--nav-hover);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.lang-separator {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.theme-btn {
  padding: 0.5rem;
  border: none;
  background: var(--nav-bg);
  backdrop-filter: blur(12px);
  color: var(--secondary-color);
  cursor: pointer;
  transition: all var(--transition-normal);
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-btn:hover {
  background: var(--nav-hover);
}

.theme-icon {
  width: 1.2rem;
  height: 1.2rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.8;
}

.theme-icon.light {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'%3E%3C/path%3E%3C/svg%3E");
}

.theme-icon.dark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='5'%3E%3C/circle%3E%3Cline x1='12' y1='1' x2='12' y2='3'%3E%3C/line%3E%3Cline x1='12' y1='21' x2='12' y2='23'%3E%3C/line%3E%3Cline x1='4.22' y1='4.22' x2='5.64' y2='5.64'%3E%3C/line%3E%3Cline x1='18.36' y1='18.36' x2='19.78' y2='19.78'%3E%3C/line%3E%3Cline x1='1' y1='12' x2='3' y2='12'%3E%3C/line%3E%3Cline x1='21' y1='12' x2='23' y2='12'%3E%3C/line%3E%3Cline x1='4.22' y1='19.78' x2='5.64' y2='18.36'%3E%3C/line%3E%3Cline x1='18.36' y1='5.64' x2='19.78' y2='4.22'%3E%3C/line%3E%3C/svg%3E");
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 2rem 2rem;
}

.section {
  margin-bottom: 6rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 3rem;
  text-align: center;
  color: var(--primary-color);
}

.intro-text {
  text-align: center;
  font-size: 1.2rem;
  color: var(--secondary-color);
  margin-bottom: 2rem;
}

.skills-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.projects-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 6rem 0 4rem;
}

.avatar-container {
  position: relative;
  width: 130px;
  height: 130px;
  margin: 0 auto 2rem;
  border-radius: 50%;
}

.avatar {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  transition: transform var(--transition-normal);
  background-color: var(--background-color);
}

.avatar:hover {
  transform: scale(1.02);
}

.name {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.role {
  color: var(--secondary-color);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.intro {
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  color: var(--secondary-color);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1rem 2rem;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .section {
    margin-bottom: 4rem;
  }
}

/* 添加到 variables.css */
:root {
  --accent-color-rgb: 52, 152, 219; /* 对应 #3498db */
}

/* 深色模式下的样式 */
[data-theme='dark'] .nav-menu {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style> 