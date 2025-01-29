<template>
  <div class="skill-tag">
    {{ name }}
    <span class="skill-glow"></span>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.skill-tag {
  position: relative;
  padding: 8px 16px;
  background-color: var(--accent-color);
  color: white;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all var(--transition-normal);
  overflow: hidden;
  cursor: default;
}

.skill-tag:hover {
  transform: translateY(-2px) scale(1.05);
  background-color: var(--accent-light);
  box-shadow: var(--shadow-md);
}

.skill-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: skewX(-20deg);
  animation: glow 3s infinite linear;
  opacity: 0;
}

.skill-tag:hover .skill-glow {
  opacity: 1;
}

@keyframes glow {
  from {
    left: -50px;
  }
  to {
    left: 150%;
  }
}
</style> 