const round = (value, places = 1) => {
  const multiplier = 10 ** places
  return Math.round(value * multiplier) / multiplier
}

const metric = (key, title, value, status, score, criterion, description, suffix) => ({
  key,
  title,
  value,
  displayValue: `${round(value, 2)}${suffix}`,
  status,
  score,
  criterion,
  description,
})

const analyzeInterestCoverage = (profit, interest) => {
  const value = profit / interest
  if (value >= 2.5) return metric('interestCoverage', '이자보상배율', value, 'safe', 35, '2.5배 이상', '이자 지급 능력이 양호합니다.', '배')
  if (value >= 1.5) return metric('interestCoverage', '이자보상배율', value, 'warning', 22, '1.5배 이상 2.5배 미만', '영업이익 감소 여부를 확인해야 합니다.', '배')
  return metric('interestCoverage', '이자보상배율', value, 'danger', 5, '1.5배 미만', '이자비용 부담이 높은 상태입니다.', '배')
}

const analyzeDebtRatio = (liabilities, equity) => {
  const value = (liabilities / equity) * 100
  if (value <= 100) return metric('debtRatio', '부채비율', value, 'safe', 35, '100% 이하', '부채 부담이 비교적 낮습니다.', '%')
  if (value <= 200) return metric('debtRatio', '부채비율', value, 'warning', 22, '100% 초과 200% 이하', '부채 수준을 지속적으로 확인해야 합니다.', '%')
  return metric('debtRatio', '부채비율', value, 'danger', 5, '200% 초과', '자기자본 대비 부채 부담이 높습니다.', '%')
}

const analyzeCashFlow = (value) => {
  if (value > 0) return metric('operatingCashFlow', '영업활동현금흐름', value, 'safe', 30, '0보다 큼', '본업에서 현금을 창출하고 있습니다.', '억원')
  if (value === 0) return metric('operatingCashFlow', '영업활동현금흐름', value, 'warning', 15, '0', '영업활동 현금 창출이 없습니다.', '억원')
  return metric('operatingCashFlow', '영업활동현금흐름', value, 'danger', 0, '0보다 작음', '본업에서 현금이 유출되고 있습니다.', '억원')
}

export const useCreditAnalysis = () => ({
  analyze(financialData) {
    const metrics = [
      analyzeInterestCoverage(financialData.operatingProfit, financialData.interestExpense),
      analyzeDebtRatio(financialData.totalLiabilities, financialData.totalEquity),
      analyzeCashFlow(financialData.operatingCashFlow),
    ]
    const score = metrics.reduce((sum, item) => sum + item.score, 0)
    const status = score >= 70 ? 'safe' : score >= 50 ? 'warning' : 'danger'
    const summary = status === 'safe'
      ? '핵심 재무지표가 전반적으로 양호합니다.'
      : status === 'warning'
        ? '일부 지표에 주의가 필요합니다.'
        : '재무안정성 또는 상환능력이 취약할 가능성이 있습니다.'
    return { score, status, summary, metrics, analyzedAt: new Date().toISOString() }
  },
})
