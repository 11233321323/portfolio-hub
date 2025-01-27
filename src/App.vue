<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('dark-mode')) {
          document.documentElement.style.backgroundColor = '#1a1a1a';
        } else {
          document.documentElement.style.backgroundColor = '#ffffff';
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style> 