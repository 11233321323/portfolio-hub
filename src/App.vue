<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.app {
  font-family: var(--font-family);
  color: var(--primary-color);
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-duration);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 