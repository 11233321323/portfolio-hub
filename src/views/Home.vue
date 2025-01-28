<template>
  <div class="home">
    <header>
      <h1>{{ messages[currentLang].name }}</h1>
      <p>{{ messages[currentLang].title }}</p>
    </header>

    <section class="about">
      <h2>{{ messages[currentLang].about.title }}</h2>
      <p>{{ messages[currentLang].about.content }}</p>
    </section>

    <section class="skills">
      <h2>{{ messages[currentLang].skills.title }}</h2>
      <ul>
        <li v-for="skill in messages[currentLang].skills" :key="skill">{{ skill }}</li>
      </ul>
    </section>

    <section class="projects">
      <h2>{{ messages[currentLang].projects.title }}</h2>
      <div class="project-grid">
        <div v-for="project in messages[currentLang].projects" :key="project.id" class="project-card">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <a :href="project.link" target="_blank">{{ messages[currentLang].projects.viewProject }}</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { messages } from '../locales';

export default {
  name: 'Home',
  data() {
    return {
      messages,
      currentLang: 'zh'
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  header {
    text-align: center;
    margin-bottom: 3rem;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      color: #666;
    }
  }

  section {
    margin-bottom: 4rem;

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }
  }

  .skills {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      list-style: none;
      padding: 0;

      li {
        background: #f5f5f5;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 1rem;
      }
    }
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;

    .project-card {
      background: #fff;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);

      h3 {
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 1rem;
        color: #666;
      }

      a {
        color: #3498db;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
