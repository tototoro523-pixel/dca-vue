<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="financial-section">
    <header class="section-header">
      <h2 class="section-title">
        {{ title }}
      </h2>

      <p
        v-if="description"
        class="section-description"
      >
        {{ description }}
      </p>
    </header>

    <div class="section-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.financial-section {
  padding: 20px;

  background-color: var(--color-surface, #1a1a1a);
  border: 1px solid #292929;
  border-radius: var(--radius-medium, 16px);
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 6px;

  color: var(--color-text-primary, #ffffff);
  font-size: 18px;
  font-weight: 800;
}

.section-description {
  margin: 0;

  color: var(--color-text-secondary, #9ca3af);
  font-size: 13px;
  line-height: 1.5;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>
