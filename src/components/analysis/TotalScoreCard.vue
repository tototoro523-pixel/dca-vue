<script setup>
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps({
  companyName: {
    type: String,
    required: true,
  },

  result: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section :class="['score-card', `score-card--${result.status}`]">
    <div class="score-header">
      <div>
        <p class="company-name">
          {{ companyName }}
        </p>

        <h2>종합 신용분석</h2>
      </div>

      <StatusBadge :status="result.status" />
    </div>

    <div class="score-area">
      <strong class="score-number">
        {{ result.score }}
      </strong>

      <span class="score-total">
        / 100점
      </span>
    </div>

    <div
      class="score-progress"
      aria-label="종합점수"
    >
      <span
        class="score-progress-bar"
        :style="{ width: `${result.score}%` }"
      />
    </div>

    <p class="score-summary">
      {{ result.summary }}
    </p>
  </section>
</template>

<style scoped>
.score-card {
  padding: 24px;

  background-color: var(--color-surface, #1a1a1a);
  border: 1px solid #303030;
  border-radius: 20px;
}

.score-card--safe {
  border-color: rgb(16 185 129 / 45%);
}

.score-card--warning {
  border-color: rgb(245 158 11 / 45%);
}

.score-card--danger {
  border-color: rgb(239 68 68 / 45%);
}

.score-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.company-name {
  margin: 0 0 6px;

  color: var(--color-primary, #2563eb);
  font-size: 13px;
  font-weight: 800;
}

.score-header h2 {
  margin: 0;

  color: var(--color-text-primary, #ffffff);
  font-size: 20px;
}

.score-area {
  display: flex;
  align-items: baseline;
  margin-top: 26px;
}

.score-number {
  color: var(--color-text-primary, #ffffff);
  font-size: 52px;
  line-height: 1;
}

.score-total {
  margin-left: 6px;

  color: var(--color-text-secondary, #9ca3af);
  font-size: 15px;
}

.score-progress {
  height: 10px;
  margin-top: 18px;
  overflow: hidden;

  background-color: #303030;
  border-radius: 999px;
}

.score-progress-bar {
  display: block;
  height: 100%;

  background-color: var(--color-primary, #2563eb);
  border-radius: inherit;
}

.score-summary {
  margin: 18px 0 0;

  color: var(--color-text-secondary, #9ca3af);
  font-size: 14px;
  line-height: 1.65;
}
</style>