<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/components/common/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import TotalScoreCard from '@/components/analysis/TotalScoreCard.vue'
import MetricResultCard from '@/components/analysis/MetricResultCard.vue'

import { useCreditStore } from '@/stores/credit'

const router = useRouter()
const creditStore = useCreditStore()

const savedMessage = ref('')

const result = computed(() => creditStore.analysisResult)
const companyName = computed(
  () => creditStore.financialData.companyName,
)

const goToAnalysis = () => {
  router.push('/analysis')
}

const goToAiReport = () => {
  router.push('/ai-report')
}

const retryAnalysis = () => {
  creditStore.resetCurrentAnalysis()
  router.push('/analysis')
}

const saveResult = () => {
  const success = creditStore.saveCurrentAnalysis()

  savedMessage.value = success
    ? '분석 기록이 저장되었습니다.'
    : '저장할 분석 결과가 없습니다.'
}
</script>

<template>
  <div class="page">
    <AppHeader
      title="신용분석 결과"
      :show-back="true"
    />

    <main class="page-content">
      <template v-if="result">
        <TotalScoreCard
          :company-name="companyName"
          :result="result"
        />

        <section class="metric-section">
          <h2>핵심 지표 분석</h2>

          <MetricResultCard
            v-for="metric in result.metrics"
            :key="metric.key"
            :metric="metric"
          />
        </section>

        <p
          v-if="savedMessage"
          class="saved-message"
        >
          {{ savedMessage }}
        </p>

        <div class="button-group">
          <BaseButton @click="goToAiReport">
            AI 분석 리포트 보기
          </BaseButton>

          <BaseButton
            variant="secondary"
            @click="saveResult"
          >
            분석 결과 저장
          </BaseButton>

          <BaseButton
            variant="secondary"
            @click="retryAnalysis"
          >
            새로운 기업 분석하기
          </BaseButton>
        </div>

        <p class="warning-text">
          본 분석은 학습용 간이 분석이며 실제 금융기관의
          신용등급을 의미하지 않습니다.
        </p>
      </template>

      <section
        v-else
        class="empty-result"
      >
        <h1>분석 결과가 없습니다</h1>

        <p>
          기업의 재무정보를 먼저 입력해주세요.
        </p>

        <BaseButton @click="goToAnalysis">
          기업 분석 시작
        </BaseButton>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background-color: var(--color-background, #0a0a0a);
}

.page-content {
  padding: 24px 16px 48px;
}

.metric-section {
  display: flex;
  flex-direction: column;
  gap: 14px;

  margin-top: 28px;
}

.metric-section h2 {
  margin: 0 0 2px;

  color: var(--color-text-primary, #ffffff);
  font-size: 19px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-top: 28px;
}

.saved-message {
  margin: 20px 0 0;
  padding: 12px 14px;

  color: #6ee7b7;
  font-size: 13px;

  background-color: rgb(16 185 129 / 12%);
  border-radius: 12px;
}

.warning-text {
  margin: 20px 0 0;

  color: var(--color-text-secondary, #9ca3af);
  font-size: 12px;
  line-height: 1.6;
  text-align: center;
}

.empty-result {
  padding-top: 72px;
  text-align: center;
}

.empty-result h1 {
  margin: 0 0 12px;
  color: var(--color-text-primary, #ffffff);
}

.empty-result p {
  margin: 0 0 24px;
  color: var(--color-text-secondary, #9ca3af);
}
</style>