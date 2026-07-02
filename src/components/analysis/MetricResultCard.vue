<script setup>
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps({
  metric: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="metric-card">
    <header class="metric-header">
      <h3>
        {{ metric.title }}
      </h3>

      <StatusBadge :status="metric.status" />
    </header>

    <strong class="metric-value">
      {{ metric.displayValue }}
    </strong>

    <p class="metric-description">
      {{ metric.description }}
    </p>

    <p class="metric-criterion">
      {{ metric.criterion }}
    </p>
  </article>
</template>

<style scoped>
.metric-card {
  padding: 20px;

  background-color: var(--color-surface, #1a1a1a);
  border: 1px solid #292929;
  border-radius: var(--radius-medium, 16px);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.metric-header h3 {
  margin: 0;

  color: var(--color-text-primary, #ffffff);
  font-size: 16px;
}

.metric-value {
  display: block;
  margin-top: 18px;

  color: var(--color-text-primary, #ffffff);
  font-size: 30px;
}

.metric-description {
  margin: 12px 0 0;

  color: var(--color-text-secondary, #9ca3af);
  font-size: 14px;
  line-height: 1.6;
}

.metric-criterion {
  margin: 14px 0 0;
  padding-top: 14px;

  color: #7c8aa0;
  font-size: 12px;

  border-top: 1px solid #303030;
}
</style>