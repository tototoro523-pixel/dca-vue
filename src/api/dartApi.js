import dartClient from './dartclient'
import JSZip from 'jszip'

let corporationListPromise

const loadCorporationList = async () => {
  if (!corporationListPromise) {
    corporationListPromise = (async () => {
      const response = await dartClient.get('/corpCode.xml', {
        responseType: 'arraybuffer',
      })
      const zip = await JSZip.loadAsync(response.data)
      const xmlFile = Object.values(zip.files).find(
        (file) => !file.dir && file.name.toLowerCase().endsWith('.xml'),
      )

      if (!xmlFile) {
        throw new Error('DART 기업 고유번호 파일을 찾지 못했습니다.')
      }

      const xmlText = await xmlFile.async('string')
      const document = new DOMParser().parseFromString(xmlText, 'application/xml')

      if (document.querySelector('parsererror')) {
        throw new Error('DART 기업 고유번호 파일을 해석하지 못했습니다.')
      }

      return Array.from(document.querySelectorAll('list')).map((element) => ({
        corpCode: element.querySelector('corp_code')?.textContent?.trim() ?? '',
        corpName: element.querySelector('corp_name')?.textContent?.trim() ?? '',
        stockCode: element.querySelector('stock_code')?.textContent?.trim() ?? '',
      }))
    })().catch((error) => {
      corporationListPromise = undefined
      throw error
    })
  }

  return corporationListPromise
}

export const findCorporationByName = async (companyName) => {
  const normalizedName = companyName.replaceAll(/\s/g, '').toLowerCase()

  if (!normalizedName) {
    throw new Error('기업명을 입력해주세요.')
  }

  const corporations = await loadCorporationList()
  const matches = corporations.filter(
    (corporation) =>
      corporation.corpName.replaceAll(/\s/g, '').toLowerCase() === normalizedName,
  )

  if (matches.length === 0) {
    throw new Error(`'${companyName}' 기업을 DART에서 찾지 못했습니다.`)
  }

  return matches.find((corporation) => corporation.stockCode) ?? matches[0]
}

export const getSingleCompanyAccounts = async ({
  corpCode,
  businessYear,
  reportCode,
  financialStatementDivision = 'CFS',
}) => {
  const response = await dartClient.get('/fnlttSinglAcntAll.json', {
    params: {
      corp_code: corpCode,
      bsns_year: businessYear,
      reprt_code: reportCode,
      fs_div: financialStatementDivision,
    },
  })

  return response.data
}

export const convertWonToEok = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return null
  }

  const wonAmount = Number(String(amount).replaceAll(',', ''))

  if (!Number.isFinite(wonAmount)) {
    return null
  }

  return wonAmount / 100_000_000
}

export const extractCreditFinancialData = (dartData) => {
  if (dartData.status !== '000') {
    throw new Error(
      dartData.message || 'DART 재무정보 조회에 실패했습니다.',
    )
  }

  const accountList = Array.isArray(dartData.list)
    ? dartData.list
    : []
  const findAccount = ({ statement, ids, names }) => {
    const statementAccounts = accountList.filter(
      (item) => item.sj_div === statement,
    )

    return statementAccounts.find((item) => ids.includes(item.account_id)) ??
      statementAccounts.find((item) => names.includes(item.account_nm))
  }

  const accountDefinitions = {
    operatingProfit: {
      statement: 'IS',
      ids: ['dart_OperatingIncomeLoss'],
      names: ['영업이익', '영업이익(손실)'],
    },
    interestExpense: {
      statement: 'IS',
      ids: [
        'dart_InterestExpenseNonOperating',
        'ifrs-full_InterestExpense',
        'ifrs-full_FinanceCosts',
      ],
      names: ['이자비용', '금융비용'],
    },
    totalLiabilities: {
      statement: 'BS',
      ids: ['ifrs-full_Liabilities'],
      names: ['부채총계'],
    },
    totalEquity: {
      statement: 'BS',
      ids: ['ifrs-full_Equity'],
      names: ['자본총계'],
    },
    operatingCashFlow: {
      statement: 'CF',
      ids: ['ifrs-full_CashFlowsFromUsedInOperatingActivities'],
      names: [
        '영업활동 현금흐름',
        '영업활동현금흐름',
        '영업활동으로 인한 현금흐름',
      ],
    },
  }

  return Object.fromEntries(
    Object.entries(accountDefinitions).map(([key, definition]) => {
      const account = findAccount(definition)

      if (!account) {
        throw new Error(`${definition.names[0]} 계정을 찾지 못했습니다.`)
      }

      const amount = convertWonToEok(account.thstrm_amount)

      if (amount === null) {
        throw new Error(`${account.account_nm} 금액을 변환하지 못했습니다.`)
      }

      return [key, amount]
    }),
  )
}
