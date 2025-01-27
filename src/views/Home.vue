<template>
  <div class="home" :class="{ 'dark-mode': profile.theme?.isDark }" :style="themeStyle">
    <nav class="nav-bar">
      <div class="nav-brand">
        <h1>{{ currentLang === 'zh' ? '个人主页' : 'Portfolio' }}</h1>
      </div>
      <div class="nav-controls">
        <div class="language-switch">
          <button 
            @click="switchLang('zh')" 
            :class="{ active: currentLang === 'zh' }"
          >中</button>
          <button 
            @click="switchLang('en')" 
            :class="{ active: currentLang === 'en' }"
          >EN</button>
        </div>
        <div class="theme-switch">
          <button @click="toggleTheme">
            <i :class="profile.theme?.isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
        </div>
      </div>
    </nav>

    <div class="content-wrapper">
      <header class="hero">
        <div class="profile">
          <img :src="avatar" :alt="name" class="avatar">
          <h1>{{ name }}</h1>
          <p class="title">{{ title }}</p>
        </div>
        <div class="social-links">
          <a :href="social.github" target="_blank" title="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a :href="'mailto:' + social.email" title="Email">
            <i class="fas fa-envelope"></i>
          </a>
          <a :href="social.linkedin" target="_blank" title="LinkedIn">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      </header>

      <section class="about">
        <h2>{{ t('about.title') }}</h2>
        <p>{{ about }}</p>
      </section>

      <section class="skills">
        <h2>{{ t('skills.title') }}</h2>
        <div class="skill-tags">
          <span v-for="skill in skills" :key="skill">{{ skill }}</span>
        </div>
      </section>

      <section class="projects">
        <h2>{{ t('projects.title') }}</h2>
        <div class="project-grid">
          <div v-for="project in projects" :key="project.id" class="project-card">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <a :href="project.link" class="project-link" target="_blank">
              {{ t('projects.viewProject') }} →
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { messages } from '../locales'

export default {
  name: 'Home',
  data() {
    return {
      name: 'Loading...',
      title: 'Loading...',
      avatar: 'https://via.placeholder.com/150',
      about: 'Loading...',
      skills: [],
      projects: [],
      social: {
        github: '#',
        email: '',
        linkedin: '#'
      },
      currentLang: 'zh',
      messages,
      profile: {},
      isAdmin: !!localStorage.getItem('token')
    }
  },
  methods: {
    t(key) {
      const keys = key.split('.')
      let result = this.messages[this.currentLang]
      for (const k of keys) {
        result = result[k]
      }
      return result
    },
    switchLang(lang) {
      this.currentLang = lang
      // 根据语言切换内容
      this.loadProfile(lang)
    },
    async loadProfile(lang) {
      try {
        const response = await fetch(`http://localhost:3000/api/profile?lang=${lang}`);
        const data = await response.json();
        this.profile = data;
        this.name = data.name;
        this.title = data.title;
        this.avatar = data.avatar;
        this.about = data.about;
        this.skills = data.skills;
        this.projects = data.projects;
        this.social = data.social;
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },
    async toggleTheme() {
      this.profile.theme.isDark = !this.profile.theme.isDark;
      // 更新服务器数据
      try {
        await fetch(`http://localhost:3000/api/profile?lang=${this.currentLang}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.profile)
        });
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    }
  },
  async created() {
    await this.loadProfile(this.currentLang);
  },
  computed: {
    themeStyle() {
      const isDark = this.profile.theme?.isDark;
      return {
        '--primary-color': this.profile.theme?.primaryColor || '#3498db',
        '--text-color': isDark ? '#ffffff' : (this.profile.theme?.textColor || '#2c3e50'),
        '--button-color': this.profile.theme?.buttonColor || '#3498db',
        '--background-color': isDark ? '#1a1a1a' : '#f5f6fa',
        '--card-background': isDark ? '#2d2d2d' : '#ffffff',
        '--border-color': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        '--shadow-color': isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
        'background-image': this.profile.theme?.backgroundImage ? 
          `url(${this.profile.theme.backgroundImage})` : 'none',
        'background-size': 'cover',
        'background-position': 'center',
        'background-attachment': 'fixed',
        'font-family': this.profile.theme?.fontFamily || "'Helvetica Neue', Arial"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
  position: relative;
  padding-top: 80px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--card-background);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .nav-brand {
    h1 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--text-color);
    }
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 1rem;

    .language-switch {
      display: flex;
      gap: 0.5rem;

      button {
        width: 36px;
        height: 36px;
        padding: 0;
        border: 2px solid var(--button-color);
        background: transparent;
        color: var(--text-color);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover, &.active {
          background: var(--button-color);
          color: white;
          transform: translateY(-2px);
        }
      }
    }

    .theme-switch button {
      width: 36px;
      height: 36px;
      padding: 0;
      border: 2px solid var(--button-color);
      background: transparent;
      color: var(--text-color);
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      i {
        font-size: 1.2rem;
      }

      &:hover {
        background: var(--button-color);
        color: white;
        transform: translateY(-2px);
      }
    }
  }
}

.hero {
  text-align: center;
  padding: 3rem 0;

  .profile {
    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--primary-color);
      margin-bottom: 1.5rem;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .title {
      font-size: 1.2rem;
      color: var(--primary-color);
      margin-bottom: 1.5rem;
    }
  }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;

  a {
    font-size: 1.5rem;
    color: var(--text-color);
    transition: all 0.3s ease;

    &:hover {
      color: var(--primary-color);
      transform: translateY(-3px);
    }
  }
}

section {
  margin: 4rem 0;
  padding: 2rem;
  background: var(--card-background);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: var(--text-color);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 50px;
      height: 3px;
      background: var(--primary-color);
      border-radius: 3px;
    }
  }
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  span {
    padding: 0.8rem 1.5rem;
    background: var(--card-background);
    border: 1px solid var(--primary-color);
    border-radius: 25px;
    color: var(--text-color);
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    &:hover {
      background: var(--primary-color);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card {
  padding: 2rem;
  background: var(--card-background);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  p {
    color: var(--text-color);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .project-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.dark-mode {
  .nav-bar {
    background: var(--card-background);
    box-shadow: 0 2px 4px var(--shadow-color);
  }

  section {
    background: var(--card-background);
    box-shadow: 0 4px 6px var(--shadow-color);
    border-color: var(--border-color);

    &:hover {
      box-shadow: 0 8px 15px var(--shadow-color);
    }

    h2::after {
      background: var(--primary-color);
    }
  }

  .skill-tags span {
    background: var(--card-background);
    border: 1px solid var(--primary-color);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    color: var(--text-color);

    &:hover {
      background: var(--primary-color);
      color: #ffffff;
      box-shadow: 0 4px 8px var(--shadow-color);
    }
  }

  .project-card {
    background: var(--card-background);
    border-color: var(--border-color);
    
    h3, p {
      color: var(--text-color);
    }

    &:hover {
      box-shadow: 0 8px 15px var(--shadow-color);
    }
  }

  .social-links a {
    color: var(--text-color);

    &:hover {
      color: var(--primary-color);
    }
  }
}

@media (max-width: 768px) {
  .nav-bar {
    padding: 0.8rem 1rem;

    .nav-controls {
      gap: 0.5rem;

      .language-switch button,
      .theme-switch button {
        width: 32px;
        height: 32px;
      }
    }
  }

  .content-wrapper {
    padding: 1rem;
  }

  .hero {
    padding: 2rem 0;

    .profile {
      .avatar {
        width: 120px;
        height: 120px;
      }

      h1 {
        font-size: 2rem;
      }
    }
  }

  section {
    padding: 1.5rem;
    margin: 2rem 0;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .nav-bar {
    .nav-controls {
      a span {
        display: none;
      }
    }
  }
}
</style> 