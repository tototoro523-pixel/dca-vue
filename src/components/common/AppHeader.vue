<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: {
    type: String,
    required: true,
  },
  showBack: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <header class="app-header">
    <div class="header-side">
      <button
        v-if="showBack"
        type="button"
        class="back-button"
        aria-label="이전 페이지로 이동"
        @click="goBack"
      >
        ←
      </button>
    </div>

    <h1 class="header-title">{{ title }}</h1>

    <div class="header-side"></div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;

  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;

  height: 64px;
  padding: 0 8px;

  background-color: var(--color-background);
  border-bottom: 1px solid #242424;
}

.header-side {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
}

.header-title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 18px;
  text-align: center;
}

.back-button {
  width: 40px;
  height: 40px;

  color: var(--color-text-primary);
  font-size: 24px;

  background: transparent;
  border: 0;
  cursor: pointer;
}
</style>