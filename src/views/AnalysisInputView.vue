<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/components/common/AppHeader.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import TextInput from '@/components/common/TextInput.vue'
import NumberInput from '@/components/common/NumberInput.vue'
import FinancialStatementSection from '@/components/analysis/FinancialStatementSection.vue'
import {
  extractCreditFinancialData,
  findCorporationByName,
  getSingleCompanyAccounts,
} from '@/api/dartApi'
import { useCreditAnalysis } from '@/components/composables/useCreditAnalysis'
import { useCreditStore } from '@/stores/credit'

const router = useRouter()
const creditStore = useCreditStore()
const { analyze } = useCreditAnalysis()

const companyName = ref('')
const operatingProfit = ref(null)
const interestExpense = ref(null)
const totalLiabilities = ref(null)
const totalEquity = ref(null)
const operatingCashFlow = ref(null)
const isDartLoading = ref(false)
const dartMessage = ref('')
const selectedYear = ref(null)
const selectedCorporation = ref(null)
const currentYear = new Date().getFullYear()
const availableYears = Array.from(
  { length: 5 },
  (_, index) => currentYear - 1 - index,
)

const errors = reactive({
  companyName: '',
  operatingProfit: '',
  interestExpense: '',
  totalLiabilities: '',
  totalEquity: '',
  operatingCashFlow: '',
})

const isValidNumber = (value) => {
  return value !== null && Number.isFinite(Number(value))
}

const clearErrors = () => {
  errors.companyName = ''
  errors.operatingProfit = ''
  errors.interestExpense = ''
  errors.totalLiabilities = ''
  errors.totalEquity = ''
  errors.operatingCashFlow = ''
}

const validateForm = () => {
  clearErrors()

  const trimmedCompanyName = companyName.value.trim()

  if (!trimmedCompanyName) {
    errors.companyName = '기업명을 입력해주세요.'
  }

  if (!isValidNumber(operatingProfit.value)) {
    errors.operatingProfit = '영업이익을 입력해주세요.'
  }

  if (!isValidNumber(interestExpense.value) || interestExpense.value <= 0) {
    errors.interestExpense = '0보다 큰 이자비용을 입력해주세요.'
  }

  if (!isValidNumber(totalLiabilities.value) || totalLiabilities.value < 0) {
    errors.totalLiabilities = '0 이상의 총부채를 입력해주세요.'
  }

  if (!isValidNumber(totalEquity.value) || totalEquity.value <= 0) {
    errors.totalEquity = '0보다 큰 자기자본을 입력해주세요.'
  }

  if (!isValidNumber(operatingCashFlow.value)) {
    errors.operatingCashFlow = '영업활동현금흐름을 입력해주세요.'
  }

  return Object.values(errors).every((errorMessage) => errorMessage === '')
}

watch(companyName, () => {
  selectedYear.value = null
  selectedCorporation.value = null
  dartMessage.value = ''
})

const loadDartFinancialData = async (businessYear) => {
  if (isDartLoading.value) return

  if (!companyName.value.trim()) {
    errors.companyName = '기업명을 입력해주세요.'
    dartMessage.value = '기업명을 먼저 입력해주세요.'
    return
  }

  isDartLoading.value = true
  selectedYear.value = businessYear
  dartMessage.value = `${businessYear}년 사업보고서 조회 중...`

  try {
    const corporation = await findCorporationByName(companyName.value)
    const data = await getSingleCompanyAccounts({
      corpCode: corporation.corpCode,
      businessYear: String(businessYear),
      reportCode: '11011',
    })

    const financialData = extractCreditFinancialData(data)

    selectedCorporation.value = corporation
    operatingProfit.value = financialData.operatingProfit
    interestExpense.value = financialData.interestExpense
    totalLiabilities.value = financialData.totalLiabilities
    totalEquity.value = financialData.totalEquity
    operatingCashFlow.value = financialData.operatingCashFlow
    dartMessage.value = `${corporation.corpName}의 ${businessYear}년 재무정보를 불러왔습니다.`
  } catch (error) {
    console.error('DART API 요청 실패', error)
    dartMessage.value =
      error instanceof Error ? error.message : 'DART 조회에 실패했습니다.'
  } finally {
    isDartLoading.value = false
  }
}

const submitAnalysis = () => {
  if (!validateForm()) {
    console.log('입력값 검증 실패')
    return
  }

  const financialData = {
    companyName: companyName.value.trim(),
    operatingProfit: operatingProfit.value,
    interestExpense: interestExpense.value,
    totalLiabilities: totalLiabilities.value,
    totalEquity: totalEquity.value,
    operatingCashFlow: operatingCashFlow.value,
  }

  creditStore.setFinancialData(financialData)
  creditStore.setAnalysisResult(analyze(financialData))
  router.push('/result')
}
</script>

<template>
  <div class="page">
    <AppHeader title="재무정보 입력" :show-back="true" />

    <main class="page-content">
      <header class="intro">
        <p class="intro-label">간이 신용분석</p>

        <h1>기업의 재무정보를 입력하세요</h1>

        <p class="intro-description">
          기업명은 한글과 영어만 입력할 수 있고, 재무정보는 숫자로 입력합니다.
        </p>
      </header>

      <form class="analysis-form" novalidate @submit.prevent="submitAnalysis">
        <FinancialStatementSection title="기업 정보" description="분석할 기업의 이름을 입력합니다.">
          <TextInput
            id="company-name"
            v-model="companyName"
            label="기업명"
            placeholder="예: 삼성전자"
            help-text="분석할 기업명을 입력하세요."
            :error-message="errors.companyName"
            required
          />

          <div class="year-selector">
            <p class="year-selector__label">사업보고서 연도 선택</p>

            <div class="year-selector__buttons">
              <button
                v-for="year in availableYears"
                :key="year"
                type="button"
                :class="['year-button', { 'year-button--selected': selectedYear === year }]"
                :disabled="isDartLoading"
                @click="loadDartFinancialData(year)"
              >
                {{ year }}년
              </button>
            </div>
          </div>

          <p v-if="dartMessage" class="dart-message">{{ dartMessage }}</p>
          <p v-if="selectedCorporation" class="corp-code">
            DART 고유번호: {{ selectedCorporation.corpCode }}
          </p>
        </FinancialStatementSection>

        <FinancialStatementSection
          title="손익계산서"
          description="기업의 이익과 이자 부담을 확인하는 수치입니다."
        >
          <NumberInput
            id="operating-profit"
            v-model="operatingProfit"
            label="영업이익"
            unit="억원"
            help-text="손익계산서의 영업이익입니다. 적자인 경우 음수로 입력할 수 있습니다."
            :error-message="errors.operatingProfit"
            required
          />

          <NumberInput
            id="interest-expense"
            v-model="interestExpense"
            label="이자비용"
            unit="억원"
            :min="0"
            help-text="이자보상배율 계산에 사용하는 채무상환능력 지표입니다."
            :error-message="errors.interestExpense"
            required
          />
        </FinancialStatementSection>

        <FinancialStatementSection
          title="재무상태표"
          description="기업의 부채와 재무안정성을 확인합니다."
        >
          <NumberInput
            id="total-liabilities"
            v-model="totalLiabilities"
            label="총부채"
            unit="억원"
            :min="0"
            help-text="재무상태표의 부채총계를 입력하세요."
            :error-message="errors.totalLiabilities"
            required
          />

          <NumberInput
            id="total-equity"
            v-model="totalEquity"
            label="자기자본"
            unit="억원"
            :min="0"
            help-text="재무상태표의 자본총계를 입력하세요."
            :error-message="errors.totalEquity"
            required
          />
        </FinancialStatementSection>

        <FinancialStatementSection
          title="현금흐름표"
          description="기업 본업의 실제 현금창출력을 확인합니다."
        >
          <NumberInput
            id="operating-cash-flow"
            v-model="operatingCashFlow"
            label="영업활동현금흐름"
            unit="억원"
            help-text="음수라면 마이너스 기호를 포함해 입력하세요."
            :error-message="errors.operatingCashFlow"
            required
          />
        </FinancialStatementSection>

        <BaseButton type="submit"> 신용분석 시작 </BaseButton>
      </form>
    </main>

    <BottomNavigation />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background-color: var(--color-background, #0a0a0a);
}

.page-content {
  padding: 24px 16px 112px;
}

.intro {
  margin-bottom: 24px;
}

.intro-label {
  margin: 0 0 8px;
  color: var(--color-primary, #2563eb);
  font-size: 13px;
  font-weight: 800;
}

.intro h1 {
  margin: 0 0 10px;
  color: var(--color-text-primary, #ffffff);
  font-size: 25px;
  line-height: 1.4;
}

.intro-description {
  margin: 0;
  color: var(--color-text-secondary, #9ca3af);
  font-size: 14px;
  line-height: 1.6;
}

.analysis-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.year-selector__label {
  margin: 16px 0 10px;
  color: var(--color-text-primary, #fff);
  font-size: 14px;
  font-weight: 700;
}

.year-selector__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.year-button {
  padding: 9px 13px;
  color: var(--color-text-secondary, #9ca3af);
  background: transparent;
  border: 1px solid #374151;
  border-radius: 10px;
  cursor: pointer;
}

.year-button--selected {
  color: #fff;
  background: var(--color-primary, #2563eb);
  border-color: var(--color-primary, #2563eb);
}

.year-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.dart-message,
.corp-code {
  margin: 10px 0 0;
  color: var(--color-text-secondary, #9ca3af);
  font-size: 13px;
}
</style>
