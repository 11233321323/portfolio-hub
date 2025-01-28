<template>
  <div class="home" :class="{ 'dark-mode': isDark }" :style="themeStyle">
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
            <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
        </div>
      </div>
    </nav>

    <div class="content-wrapper">
      <header class="hero">
        <div class="profile">
          <img :src="profileData.avatar" :alt="profileData.name" class="avatar">
          <h1>{{ profileData.name }}</h1>
          <p class="title">{{ profileData.title }}</p>
        </div>
        <div class="social-links">
          <a :href="profileData.social.github" target="_blank" title="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a :href="'mailto:' + profileData.social.email" title="Email">
            <i class="fas fa-envelope"></i>
          </a>
          <a :href="profileData.social.linkedin" target="_blank" title="LinkedIn">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      </header>

      <section class="about">
        <h2>{{ messages[currentLang].about.title }}</h2>
        <p>{{ messages[currentLang].about.content }}</p>
      </section>

      <section class="skills">
        <h2>{{ messages[currentLang].skills.title }}</h2>
        <div class="skill-tags">
          <span v-for="skill in messages[currentLang].skills.list" :key="skill">{{ skill }}</span>
        </div>
      </section>

      <section class="projects">
        <h2>{{ messages[currentLang].projects.title }}</h2>
        <div class="project-grid">
          <div v-for="project in messages[currentLang].projects.list" :key="project.id" class="project-card">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <a :href="project.link" class="project-link" target="_blank">
              {{ messages[currentLang].projects.viewProject }} →
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
      currentLang: 'zh',
      messages,
      isDark: false,
      profileData: {
        name: messages.zh.name,
        title: messages.zh.title,
        avatar: 'https://via.placeholder.com/150',
        social: {
          github: 'https://github.com',
          email: 'example@email.com',
          linkedin: 'https://linkedin.com'
        }
      },
      themeStyle: {
        '--primary-color': '#3498db',
        '--text-color': '#2c3e50',
        '--bg-color': '#ffffff'
      }
    }
  },
  methods: {
    switchLang(lang) {
      this.currentLang = lang;
      this.profileData.name = messages[lang].name;
      this.profileData.title = messages[lang].title;
    },
    toggleTheme() {
      this.isDark = !this.isDark;
      if (this.isDark) {
        this.themeStyle['--bg-color'] = '#1a1a1a';
        this.themeStyle['--text-color'] = '#ffffff';
      } else {
        this.themeStyle['--bg-color'] = '#ffffff';
        this.themeStyle['--text-color'] = '#2c3e50';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;

  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;

    .nav-brand h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .nav-controls {
      display: flex;
      gap: 1rem;

      button {
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;

        &.active {
          background-color: var(--primary-color);
          color: white;
        }

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    margin-bottom: 4rem;

    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-bottom: 1rem;
    }

    .title {
      color: var(--primary-color);
      font-size: 1.2rem;
    }
  }

  .social-links {
    margin-top: 1rem;

    a {
      color: var(--text-color);
      font-size: 1.5rem;
      margin: 0 0.5rem;
      text-decoration: none;

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  section {
    margin-bottom: 4rem;

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
    }
  }

  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;

    span {
      background-color: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;

    .project-card {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      h3 {
        margin-bottom: 1rem;
        color: var(--primary-color);
      }

      p {
        margin-bottom: 1rem;
        line-height: 1.6;
      }

      .project-link {
        color: var(--primary-color);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.dark-mode {
  --primary-color: #3498db;
  --text-color: #ffffff;
  --bg-color: #1a1a1a;
}
</style> 