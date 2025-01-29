<template>
  <div class="avatar">
    <img 
      src="https://via.placeholder.com/150" 
      alt="头像"
      class="avatar-img"
    >
  </div>
</template>

<script setup>
</script>

<style scoped>
.avatar {
  display: inline-block;
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid var(--primary-color);
  transition: transform var(--transition-duration);
}

.avatar-img:hover {
  transform: scale(1.05);
}
</style> 