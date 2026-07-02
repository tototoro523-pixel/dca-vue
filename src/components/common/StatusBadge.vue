<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'neutral',
    validator: (value) =>
      ['safe', 'warning', 'danger', 'neutral'].includes(value),
  },

  label: {
    type: String,
    default: '',
  },
})

const defaultLabels = {
  safe: '안정',
  warning: '주의',
  danger: '위험',
  neutral: '미분석',
}

const displayLabel = computed(() => {
  return props.label || defaultLabels[props.status]
})
</script>

<template>
  <span :class="['status-badge', `status-badge--${status}`]">
    {{ displayLabel }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 28px;
  padding: 0 10px;

  font-size: 12px;
  font-weight: 800;

  border-radius: 999px;
}

.status-badge--safe {
  color: #6ee7b7;
  background-color: rgb(16 185 129 / 15%);
}

.status-badge--warning {
  color: #fbbf24;
  background-color: rgb(245 158 11 / 15%);
}

.status-badge--danger {
  color: #f87171;
  background-color: rgb(239 68 68 / 15%);
}

.status-badge--neutral {
  color: #d1d5db;
  background-color: #303030;
}
</style>