<template>
  <div class="project-card">
    <div class="project-content">
      <h3 class="project-title">{{ project.title }}</h3>
      <p class="project-description">{{ project.description }}</p>
      <a :href="project.link" class="project-link">
        查看项目
        <span class="arrow">→</span>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.project-card {
  background: var(--background-color);
  border-radius: 16px;
  padding: 2rem;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(52, 152, 219, 0.05) 100%
  );
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-color);
}

.project-card:hover::before {
  opacity: 1;
}

.project-content {
  position: relative;
}

.project-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.project-description {
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.project-link {
  display: inline-flex;
  align-items: center;
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-normal);
}

.arrow {
  margin-left: 4px;
  transition: transform var(--transition-normal);
}

.project-link:hover {
  color: var(--accent-light);
}

.project-link:hover .arrow {
  transform: translateX(4px);
}
</style> 