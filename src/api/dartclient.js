import axios from 'axios'

// Vite는 프로젝트 최상단의 .env.local 파일에서
// VITE_로 시작하는 환경변수만 브라우저 코드에 전달합니다.
const dartApiKey = import.meta.env.VITE_DART_API_KEY

// 보안을 위해 실제 키는 출력하지 않고, 로딩 여부와 길이만 확인합니다.
console.log('DART API 키 존재:', Boolean(dartApiKey))
console.log('DART API 키 길이:', dartApiKey?.length)

const dartClient = axios.create({
  baseURL: '/dart-api',
  timeout: 10000,
})

// 이 axios 인스턴스로 요청할 때마다 DART 인증키를 쿼리 파라미터에 자동 추가합니다.
// 예: { corp_code, bsns_year, reprt_code }
//  -> { corp_code, bsns_year, reprt_code, crtfc_key }
dartClient.interceptors.request.use(
  (config) => {
    config.params = {
      ...(config.params ?? {}),
      crtfc_key: dartApiKey,
    }

    return config
  },
  (error) => Promise.reject(error),
)

export default dartClient
