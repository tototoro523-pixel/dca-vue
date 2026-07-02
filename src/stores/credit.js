import { defineStore } from 'pinia'

const STORAGE_KEY = 'dca-credit-history'

const createEmptyFinancialData = () => ({
  companyName: '',
  operatingProfit: null,
  interestExpense: null,
  totalLiabilities: null,
  totalEquity: null,
  operatingCashFlow: null,
})

const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

const loadHistory = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const savedHistory = localStorage.getItem(STORAGE_KEY)

    if (!savedHistory) {
      return []
    }

    const parsedHistory = JSON.parse(savedHistory)

    return Array.isArray(parsedHistory) ? parsedHistory : []
  } catch (error) {
    console.error('분석 기록을 불러오지 못했습니다.', error)
    return []
  }
}

const saveHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('분석 기록을 저장하지 못했습니다.', error)
  }
}

export const useCreditStore = defineStore('credit', {
  state: () => ({
    financialData: createEmptyFinancialData(),
    analysisResult: null,
    history: loadHistory(),
  }),

  actions: {
    setFinancialData(data) {
      this.financialData = {
        ...createEmptyFinancialData(),
        ...cloneData(data),
      }
    },

    setAnalysisResult(result) {
      this.analysisResult = cloneData(result)
    },

    saveCurrentAnalysis() {
      if (!this.analysisResult) {
        return false
      }

      const recordId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now())

      const record = {
        id: recordId,
        analyzedAt: new Date().toISOString(),
        financialData: cloneData(this.financialData),
        analysisResult: cloneData(this.analysisResult),
      }

      this.history.unshift(record)
      saveHistory(this.history)

      return true
    },

    openHistoryRecord(record) {
      this.financialData = cloneData(record.financialData)
      this.analysisResult = cloneData(record.analysisResult)
    },

    removeHistoryRecord(recordId) {
      this.history = this.history.filter(
        (record) => record.id !== recordId,
      )

      saveHistory(this.history)
    },

    clearHistory() {
      this.history = []
      saveHistory(this.history)
    },

    resetCurrentAnalysis() {
      this.financialData = createEmptyFinancialData()
      this.analysisResult = null
    },
  },
})